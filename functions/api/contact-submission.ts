import schema from '../../schema.json';
import ejs from 'ejs';

type SubmissionEnvironment = {
    SUBMISSION_SUBJECT: string | undefined;
};
type SubmissionData = {
};
type SubmissionContext = EventContext<
    SubmissionEnvironment,
    string,
    SubmissionData
>;

export const onRequestPost: PagesFunction = async function onRequestPost(
    context: SubmissionContext
): Promise<Response> {
    const redirectLocation = new URL('/pages/contact.html', schema.url);
    const {
        request, // same as existing Worker API
        env, // same as existing Worker API
        //    params, // if filename includes [id] or [[path]]
        //    waitUntil, // same as ctx.waitUntil in existing Worker API
        next, // used for middleware or to fetch assets
        //    data, // arbitrary space for passing data between middleware
    } = context;

    let formData: FormData;

    try {
        formData = await request.formData();

        const subject = env.SUBMISSION_SUBJECT || 'Neue Nachricht auf Webseite';
        const name = formData.get('name') as string | undefined;
        const email = formData.get('email') as string | undefined;
        const phone = formData.get('phone') as string | undefined;
        const message = formData.get('message') as string | undefined;
        const domain = new URL(schema.url).hostname;
        const [plainContent,htmlContent] = await Promise.all([
            ejs.renderFile('../../templates/submission.txt.ejs', {
                name,
                email,
                phone,
                message,
                subject,
                schema
            }),
            ejs.renderFile('../../templates/submission.html.ejs', {
                name,
                email,
                phone,
                message,
                subject,
                schema
            })
        ]);

        await sendEmail({
            from: {
                email: `website@${domain}`,
                name,
            },
            reply_to: {
                name,
                email,
            },
            content: [
                {
                    type: 'text/plain',
                    value: plainContent,
                },
                {
                    type: 'text/html',
                    value: htmlContent,
                },
            ],
            headers: {},
            subject,
            personalizations: [
                {
                    to: [
                        {
                            name: schema.founder.name,
                            email: schema.founder.email,
                        },
                    ],
                },
            ],
        });

        redirectLocation.searchParams.append('state', 'success');

    } catch (error) {
        redirectLocation.searchParams.append('state', 'error');
        redirectLocation.searchParams.append('error', error.message);
   }

    return new Response('', {
        status: 303,
        headers: {
            Location: redirectLocation.toString(),
        },
    });

    return next();
};

export const sendEmail = async (
    payload: MailSendBody,
): Promise<Success | Failure> => {
    const response = await fetch('https://api.mailchannels.net/tx/v1/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (response.status === 202) {
        return { success: true };
    }

    try {
        const { errors } = await
            (response.clone().json() as Promise<{ errors: string[] }>);

        return {
            success: false,
            errors,
        };
    } catch {
        return {
            success: false,
            errors: [response.statusText],
        };
    }
};

interface EmailAddress {
    email: string;
    name?: string;
}

  export interface Personalization {
    to: [EmailAddress, ...EmailAddress[]];
    from?: EmailAddress;
    dkim_domain?: string;
    dkim_private_key?: string;
    dkim_selector?: string;
    reply_to?: EmailAddress;
    cc?: EmailAddress[];
    bcc?: EmailAddress[];
    subject?: string;
    headers?: Record<string, string>;
  }

  export interface ContentItem {
    type: string;
    value: string;
  }

  export interface MailSendBody {
    personalizations: [Personalization, ...Personalization[]];
    from: EmailAddress;
    reply_to?: EmailAddress;
    subject: string;
    content: [ContentItem, ...ContentItem[]];
    headers?: Record<string, string>;
  }

  interface Success {
    success: true;
  }

  interface Failure {
    success: false;
    errors: string[];
  }
