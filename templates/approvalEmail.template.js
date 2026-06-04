const approvalEmailTemplate = ({
  name,
  role,
  status,
  message,
  actionUrl,
}) => {
  const isApproved = status === "approved";

  return `
    <!DOCTYPE html>
    <html>
      <body style="font-family: Arial, sans-serif; background:#f5f5f5; padding:20px;">
        <div style="max-width:600px;margin:auto;background:#fff;padding:30px;border-radius:10px;">

          <h2 style="color:${isApproved ? "#16a34a" : "#dc2626"};">
            Account ${isApproved ? "Approved" : "Rejected"}
          </h2>

          <p>Hello <strong>${name}</strong>,</p>

          <p>
            Your <strong>${role}</strong> account has been reviewed.
          </p>

          <p>
            ${message}
          </p>

          ${
            actionUrl
              ? `
                <div style="margin:30px 0;">
                  <a
                    href="${actionUrl}"
                    style="
                      background:${isApproved ? "#16a34a" : "#dc2626"};
                      color:#fff;
                      padding:12px 24px;
                      text-decoration:none;
                      border-radius:6px;
                    "
                  >
                    ${
                      isApproved
                        ? "Login to Your Account"
                        : "Contact Support"
                    }
                  </a>
                </div>
              `
              : ""
          }

          <hr />

          <p style="font-size:14px;color:#666;">
            Regards,<br/>
            <strong>Sportz Team</strong>
          </p>

        </div>
      </body>
    </html>
  `;
};

export default approvalEmailTemplate;