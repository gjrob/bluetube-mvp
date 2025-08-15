import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { certificateNumber, firstName, lastName, userId } = req.body;

    try {
        // Step 1: Validate certificate format
        const validFormat = /^FA[A-Z]\d{7}$/i.test(certificateNumber);
        if (!validFormat) {
            return res.status(400).json({ 
                error: 'Invalid certificate format',
                details: 'Part 107 certificates start with FA followed by a letter and 7 digits'
            });
        }

        // Step 2: Check FAA Database (Real implementation would call FAA API)
        const faaResult = await checkFAADatabase(certificateNumber, lastName);
        
        if (!faaResult.valid) {
            return res.status(400).json({ 
                error: 'Certificate not valid',
                reason: faaResult.reason 
            });
        }

        // Step 3: Store verification in database
        const { data, error } = await supabase
            .from('pilot_verifications')
            .upsert({
                user_id: userId,
                certificate_number: certificateNumber,
                pilot_name: `${firstName} ${lastName}`,
                issue_date: faaResult.issueDate,
                expiry_date: faaResult.expiryDate,
                verification_status: 'verified',
                verification_date: new Date().toISOString(),
                faa_lookup_data: faaResult
            });

        if (error) throw error;

        // Step 4: Update user profile with verified status
        await supabase
            .from('users')
            .update({ 
                part107_verified: true,
                pilot_certificate: certificateNumber
            })
            .eq('id', userId);

        // Step 5: Generate verification token
        const token = jwt.sign(
            { 
                userId, 
                certificateNumber,
                verified: true 
            },
            process.env.JWT_SECRET,
            { expiresIn: '1y' }
        );

        return res.status(200).json({
            success: true,
            message: 'Part 107 certificate verified successfully',
            token,
            certificateNumber,
            expiryDate: faaResult.expiryDate
        });

    } catch (error) {
        console.error('Verification error:', error);
        return res.status(500).json({ 
            error: 'Verification failed',
            details: error.message 
        });
    }
}

// FAA Database Check Function
async function checkFAADatabase(certificateNumber, lastName) {
    // In production, this would call the real FAA API
    // For now, using mock data for testing
    
    const mockDatabase = {
        'FA3A1234567': {
            valid: true,
            pilotName: 'John Doe',
            issueDate: '2023-03-15',
            expiryDate: '2025-03-31',
            status: 'ACTIVE'
        },
        'FA4B9876543': {
            valid: true,
            pilotName: 'Jane Smith',
            issueDate: '2022-01-20',
            expiryDate: '2024-01-31',
            status: 'ACTIVE'
        }
    };

    const record = mockDatabase[certificateNumber];
    
    if (!record) {
        return { valid: false, reason: 'Certificate not found' };
    }

    // Check if expired
    const expiryDate = new Date(record.expiryDate);
    if (expiryDate < new Date()) {
        return { valid: false, reason: 'Certificate expired' };
    }

    return {
        valid: true,
        ...record
    };
}