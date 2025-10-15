const sendError = (res, message) => res.status(400).json({ error: message });

const validateCreateEvent = (req, res, next) => {
  const { title, dateTime, location, capacity } = req.body;

  if (!title || typeof title !== "string" || title.trim() === "")
    return sendError(res, "Title is required and must be a non-empty string");

  if (!dateTime) return sendError(res, "Date and time are required");

  const eventDate = new Date(dateTime);
  if (isNaN(eventDate.getTime()))
    return sendError(res, "Invalid date format. Use ISO 8601 format");

  if (eventDate < new Date())
    return sendError(res, "Event date must be in the future");

  if (!location || typeof location !== "string" || location.trim() === "")
    return sendError(res, "Location is required and must be a non-empty string");

  if (capacity !== undefined) {
    const cap = Number(capacity);
    if (!Number.isInteger(cap) || cap <= 0 || cap > 1000)
      return sendError(res, "Capacity must be an integer between 1 and 1000");
  }

  next();
};

const validateCreateUser = (req, res, next) => {
  const { name, email } = req.body;

  if (!name || typeof name !== "string" || name.trim() === "")
    return sendError(res, "Name is required and must be a non-empty string");

  if (!email || typeof email !== "string")
    return sendError(res, "Email is required");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email))
    return sendError(res, "Invalid email format");

  next();
};

const validateRegistration = (req, res, next) => {
  const { userId } = req.body;

  if (!userId || (typeof userId !== "string" && typeof userId !== "number"))
    return sendError(res, "User ID must be a valid string or number");

  next();
};

export default {
  validateCreateEvent,
  validateCreateUser,
  validateRegistration,
};
