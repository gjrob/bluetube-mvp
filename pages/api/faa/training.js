import { supabase } from '../../../lib/supabase'
export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return getTrainingData(req, res);
    case 'POST':
      return recordTrainingSession(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

async function getTrainingData(req, res) {
  try {
    const { pilotId } = req.query;

    // Get pilot's training history
    const { data: trainingHistory, error } = await supabase
      .from('pilot_training')
      .select(`
        *,
        training_modules (
          module_name,
          description,
          required_score,
          category
        )
      `)
      .eq('pilot_id', pilotId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Get available training modules
    const { data: modules, error: moduleError } = await supabase
      .from('training_modules')
      .select('*')
      .eq('active', true);

    if (moduleError) throw moduleError;

    // Calculate completion status
    const completedModules = trainingHistory?.filter(t => t.passed) || [];
    const progress = {
      totalModules: modules?.length || 0,
      completedModules: completedModules.length,
      percentComplete: modules?.length ? 
        Math.round((completedModules.length / modules.length) * 100) : 0,
      nextModule: modules?.find(m => 
        !completedModules.some(c => c.module_id === m.id)
      )
    };

    res.status(200).json({
      trainingHistory,
      availableModules: modules,
      progress,
      certificationStatus: progress.percentComplete === 100 ? 'certified' : 'in-progress'
    });

  } catch (error) {
    console.error('Training data error:', error);
    res.status(500).json({ error: 'Failed to fetch training data' });
  }
}

async function recordTrainingSession(req, res) {
  try {
    const { pilotId, moduleId, score, timeSpent, answers } = req.body;

    // Get module details
    const { data: module, error: moduleError } = await supabase
      .from('training_modules')
      .select('*')
      .eq('id', moduleId)
      .single();

    if (moduleError) throw moduleError;

    const passed = score >= module.required_score;

    // Record training session
    const { data: session, error } = await supabase
      .from('pilot_training')
      .insert({
        pilot_id: pilotId,
        module_id: moduleId,
        score,
        passed,
        time_spent: timeSpent,
        answers,
        completed_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    // Update pilot certification status if all modules complete
    if (passed) {
      const { data: allModules } = await supabase
        .from('training_modules')
        .select('id')
        .eq('active', true);

      const { data: completedModules } = await supabase
        .from('pilot_training')
        .select('module_id')
        .eq('pilot_id', pilotId)
        .eq('passed', true);

      const allComplete = allModules?.every(m => 
        completedModules?.some(c => c.module_id === m.id)
      );

      if (allComplete) {
        await supabase
          .from('pilot_certifications')
          .upsert({
            pilot_id: pilotId,
            certification_type: 'FAA_PART_107',
            certified_at: new Date().toISOString(),
            expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
          });
      }
    }

    res.status(200).json({
      session,
      passed,
      message: passed ? 
        'Congratulations! Module completed successfully.' : 
        `Score of ${module.required_score}% required. Please try again.`
    });

  } catch (error) {
    console.error('Training session error:', error);
    res.status(500).json({ error: 'Failed to record training session' });
  }
}