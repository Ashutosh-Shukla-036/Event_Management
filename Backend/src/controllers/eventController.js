import prisma from "../utils/db.js";

export const createEvent = async (req, res) => {
  try {
    const { title, dateTime, location, capacity = 1000 } = req.body;

    const event = await prisma.event.create({
      data: {
        title,
        dateTime: new Date(dateTime),
        location,
        capacity: parseInt(capacity, 10)
      }
    });

    res.status(201).json({
      message: "Event created successfully",
      event
    });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        registrations: {
          include: {
            user: {
              select: { id: true, name: true, email: true }
            }
          }
        }
      }
    });

    if (!event) return res.status(404).json({ error: "Event not found" });

    const registeredUsers = event.registrations.map(r => ({
      id: r.user.id,
      name: r.user.name,
      email: r.user.email,
      registeredAt: r.registeredAt
    }));

    res.json({
      event: {
        id: event.id,
        title: event.title,
        dateTime: event.dateTime,
        location: event.location,
        capacity: event.capacity,
        registeredUsers,
        currentRegistrations: registeredUsers.length
      }
    });
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const registerForEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const event = await prisma.event.findUnique({
      where: { id },
      include: { registrations: true }
    });
    if (!event) return res.status(404).json({ error: "Event not found" });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: "User not found" });

    if (new Date(event.dateTime) < new Date())
      return res.status(400).json({ error: "Cannot register for past events" });

    const existing = await prisma.registration.findFirst({
      where: { userId, eventId: id }
    });
    if (existing)
      return res.status(409).json({ error: "Already registered for this event" });

    if (event.registrations.length >= event.capacity)
      return res.status(400).json({ error: "Event is full" });

    const registration = await prisma.registration.create({
      data: { userId, eventId: id }
    });

    res.status(201).json({
      message: "Registered successfully",
      registration
    });
  } catch (error) {
    console.error("Error registering for event:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const cancelRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const registration = await prisma.registration.findFirst({
      where: { userId, eventId: id }
    });

    if (!registration)
      return res
        .status(404)
        .json({ error: "User is not registered for this event" });

    await prisma.registration.delete({ where: { id: registration.id } });

    res.json({ message: "Registration cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling registration:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUpcomingEvents = async (req, res) => {
  try {
    const now = new Date();

    const events = await prisma.event.findMany({
      where: { dateTime: { gt: now } },
      include: { registrations: true }
    });

    const formatted = events
      .sort((a, b) => a.dateTime - b.dateTime)
      .map(e => ({
        id: e.id,
        title: e.title,
        dateTime: e.dateTime,
        location: e.location,
        capacity: e.capacity,
        currentRegistrations: e.registrations.length,
        availableSpots: e.capacity - e.registrations.length
      }));

    res.json({ upcomingEvents: formatted, total: formatted.length });
  } catch (error) {
    console.error("Error fetching upcoming events:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getEventStats = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await prisma.event.findUnique({
      where: { id },
      include: { registrations: true }
    });
    if (!event) return res.status(404).json({ error: "Event not found" });

    const totalRegistrations = event.registrations.length;
    const remaining = event.capacity - totalRegistrations;
    const percentage = ((totalRegistrations / event.capacity) * 100).toFixed(2);

    res.json({
      eventId: event.id,
      title: event.title,
      stats: {
        totalRegistrations,
        remainingCapacity: remaining,
        capacity: event.capacity,
        percentageUsed: parseFloat(percentage),
        isFull: remaining === 0
      }
    });
  } catch (error) {
    console.error("Error fetching event stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
