const escapeHtml = (value) =>
    String(value).replace(/[&<>"']/g, (character) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);

export const createOtpEmailTemplate = ({ otp, subject }) => `
    <!doctype html>
    <html lang="en">
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>${escapeHtml(subject)}</title>
        </head>
        <body style="margin:0;padding:24px;background-color:#f4f6f8;font-family:Arial,sans-serif;color:#202124;">
            <main style="max-width:520px;margin:0 auto;padding:32px;background-color:#ffffff;border-radius:12px;">
                <h1 style="margin:0 0 24px;font-size:24px;">${escapeHtml(subject)}</h1>
                <p style="margin:0 0 16px;font-size:16px;line-height:1.5;">Use this one-time password to continue:</p>
                <p style="margin:0 0 24px;padding:16px;background-color:#f4f6f8;border-radius:8px;text-align:center;font-size:32px;font-weight:bold;letter-spacing:8px;">
                    ${escapeHtml(otp)}
                </p>
                <p style="margin:0;font-size:14px;line-height:1.5;color:#5f6368;">If you did not request this code, you can ignore this email.</p>
            </main>
        </body>
    </html>
`;
