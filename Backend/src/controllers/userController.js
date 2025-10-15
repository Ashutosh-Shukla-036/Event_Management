import prisma from "../utils/db.js";

export const createUser = async (req, res) => {
  try {
    const { name, email } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: "User with this email already exists" });
    }

    const user = await prisma.user.create({ data: { name, email } });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, createdAt: true },
      orderBy: { createdAt: "desc" }
    });

    res.json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        registrations: {
          include: { event: true }
        }
      }
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    const formattedRegistrations = user.registrations.map(r => ({
      eventId: r.event.id,
      eventTitle: r.event.title,
      dateTime: r.event.dateTime,
      location: r.event.location,
      registeredAt: r.registeredAt
    }));

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        registrations: formattedRegistrations
      }
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
