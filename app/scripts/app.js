let client;

init();

async function init() {
  client = await app.initialized();
  client.events.on('app.activated', onAppActivated);
}

async function onAppActivated() {
  await renderGravatar();
  await getTicketDetails();
}

async function renderGravatar() {
  try {
    const contactData = await client.data.get('contact');
    const { contact: { email } } = contactData;

    const hashedEmail = CryptoJS.MD5(email.trim().toLowerCase()).toString();
    const gravatarUrl = `https://www.gravatar.com/avatar/${hashedEmail}`;

    document.getElementById('gravatar-image').src = gravatarUrl;
  } catch (error) {
    console.error("Error fetching contact data: ", error);
  }
}

async function getTicketDetails() {
  try {
    const data = await client.data.get("ticket");
    const { ticket: { id, created_at, updated_at, status_type, priority, description } } = data;

    // Convert timestamp strings (created_at and updated_at) to Date objects
    const createdAtFormatted = new Date(created_at).toLocaleString();
    const updatedAtFormatted = new Date(updated_at).toLocaleString();
    const descriptionFormatted = description ? description.trim() : 'No description';

    // Update the HTML content to display formatted ticket details
    document.getElementById('tickets').innerHTML = `
      ID: ${id}<br>
      Description: ${descriptionFormatted}<br>
      Status Type: ${status_type}<br>
      Priority: ${priority}<br>
      Created At: ${createdAtFormatted}<br>
      Updated At: ${updatedAtFormatted}
    `;
  } catch (error) {
    console.error("Error fetching ticket data: ", error);
  }
}
