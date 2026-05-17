import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { type, to, employeeName, goalTitle, managerName } = await req.json();

  const subjects: Record<string, string> = {
    submitted: `Goal submitted for approval — ${goalTitle}`,
    approved: `Your goal has been approved — ${goalTitle}`,
    returned: `Your goal needs revision — ${goalTitle}`,
  };

  const bodies: Record<string, string> = {
    submitted: `Hi ${managerName},\n\n${employeeName} has submitted a goal for your approval:\n\n"${goalTitle}"\n\nLogin to review: https://atomquest-portal-kappa.vercel.app\n\nAtomQuest Portal`,
    approved: `Hi ${employeeName},\n\nYour goal has been approved:\n\n"${goalTitle}"\n\nLogin to log achievements: https://atomquest-portal-kappa.vercel.app\n\nAtomQuest Portal`,
    returned: `Hi ${employeeName},\n\nYour goal needs revision:\n\n"${goalTitle}"\n\nLogin to update: https://atomquest-portal-kappa.vercel.app\n\nAtomQuest Portal`,
  };

  try {
    const data = await resend.emails.send({
      from: 'AtomQuest Portal <onboarding@resend.dev>',
      to: [to],
      subject: subjects[type],
      text: bodies[type],
    });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}