/* eslint-disable eqeqeq */
/* eslint-disable no-plusplus */
/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
/* eslint-disable no-await-in-loop */
import events from "events"
import nodemailer from '../helpers/nodemailer.helper';
import { message } from "../utils/notification.utils"
import locationService from "./location.service";
import accommodationService from "./accommodations.service";
import { io, users } from '../utils/socket.utils';

const eventEmitter = new events.EventEmitter()
eventEmitter.on(
  'tripEmailNotification',
  async ({
    user,
    multiCityTrip,
    tripLocations,
    manager,
    title,
    description,
    url
  }) => {
    const depart_location = await locationService.findLocation(
      multiCityTrip.depart_location_id
    );
    let accommodationList = '';
    if (multiCityTrip.arrivalLocations === undefined) {
      for (let i = 0; i < tripLocations.length; i++) {
        const accommodation =
          await accommodationService.findSpecificAccommodation(
            tripLocations[i].accommodation_id
          );
        accommodationList += `<li>${accommodation.name}</li>`;
      }
    } else {
      for (let i = 0; i < multiCityTrip.arrivalLocations.length; i++) {
        const accommodation =
          await accommodationService.findSpecificAccommodation(
            multiCityTrip.arrivalLocations[i].accommodation_id
          );
        accommodationList += `<li>${accommodation.name}</li>`;
      }
    }

    const details = 'Trip created';
    const code = `
  <h1><strong>${title}</strong></h1>
  <p>Manager ${manager.first_name} ${manager.last_name},</p>
<p>Requester ${user.first_name} ${user.last_name} ${description}</p>
<p><strong>Details:</strong></p>
<ul>
  <li>Depart location: ${depart_location.name}</li>
  <li>Accommodation:
    <ul>
    ${accommodationList}
    </ul>
  </li>
  <li>Trip date: ${multiCityTrip.tripDate.toDateString()}</li>
  <li>Return date: ${multiCityTrip.returnDate.toDateString()}</li>
  <li>Reason: ${multiCityTrip.reason}</li>
</ul>
<table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary">
            <tbody>
              <tr>
                <td align="center">
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                    <tbody>
                      <tr>
                        <td> <a href="${url.baseUrl}/${
      url.route
    }" target="_blank">More details</a> </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>`;
    const html = message(code);
    await nodemailer(manager.email, title, details, html);
  }
);

eventEmitter.on("appNotification", async ({ recipient, notify }) => {
  for (let i = 0; i < users.length; i++) {
    if (users[i].userId == recipient.id) {
      io.to(users[i].socketId).emit("notification", notify.details)
    }
  }
})

eventEmitter.on("tripStatusEmailNotification", async ({ user, manager, trip, url }) => {
  const details = "Trip status updated"
  const code = `
  <h1><strong>Trip request status</strong></h1>
  <p>Requester ${user.first_name} ${user.last_name},</p>
  <p>Your trip have been ${trip.status}.</p><br>
  <p>Manager ${manager.first_name} ${manager.last_name}.</p>
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary">
            <tbody>
              <tr>
                <td align="center">
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                    <tbody>
                      <tr>
                        <td> <a href="${url.baseUrl}/${url.route}" target="_blank">More details</a> </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
            `
  const html = message(code);
  await nodemailer(user.email, 'Trip status updated', details, html);
})

eventEmitter.on("bookingEmailNotification", async ({ user, travel_admin, title, description, booking, url }) => {
  const details = "Booking reservation"
  const code = `
  <h1><strong>${title}</strong></h1>
  <p>Dear ${travel_admin.first_name} ${travel_admin.last_name},</p>
<p>A request for booking a room reservation has been made at your accommodation by customer ${user.first_name} ${user.last_name}, with a Check-in date of ${booking.checkinDate.toDateString()} and Check-out date of ${booking.checkoutDate.toDateString()}.</p>
<table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary">
            <tbody>
              <tr>
                <td align="center">
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                    <tbody>
                      <tr>
                        <td> <a href="${url.baseUrl}/${url.route}" target="_blank">More details</a> </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>`
  const html = message(code);
  await nodemailer(travel_admin.email, title, details, html);
})

eventEmitter.on("bookingStatusNotification", async ({ user, travel_admin, title, description, booking, url }) => {
  const details = "Booking reservation"
  const code = `
  <h1><strong>${title}</strong></h1>
  <p>Dear ${user.first_name} ${user.last_name},</p>
<p>${description}</p>
<table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary">
            <tbody>
              <tr>
                <td align="center">
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                    <tbody>
                      <tr>
                        <td> <a href="${url.baseUrl}/${url.route}" target="_blank">More details</a> </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>`
  const html = message(code);
  await nodemailer(user.email, title, details, html);
})

eventEmitter.on('tripRequestApproved', async (arrivalLocations) => {
  /* istanbul ignore next */
  arrivalLocations.forEach(async (acc) => {
    const id = acc.accommodation_id;
    const accommodation = await accommodationService.findSpecificAccommodation(
      id
    );
    const { location_id } = accommodation.dataValues;
    const location = await locationService.findLocation(location_id);
    const { visitCount } = location;
    await locationService.findAndUpdateLocation(
      { where: { id: location_id } },
      { visitCount: visitCount + 1 }
    );
  });
});

export default eventEmitter