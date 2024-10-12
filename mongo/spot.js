import connect from "./db-connect";
import Spot from "./spot";

export default async function spotHacker({ spotterId, spottedId, value }) {
  await connect();

  const spot = Spot.create({ spotterId, spottedId, value });
}
