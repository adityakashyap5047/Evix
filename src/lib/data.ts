import {
  Laptop2,
  Music2,
  Palette,
  Pizza,
  HeartPulse,
  BookOpen,
  Gamepad2,
  Handshake,
  Tent,
  Users,
  ShoppingCart,
  MenuSquare,
  Dumbbell,
} from "lucide-react";

export const CATEGORIES = [
  {
    id: "tech",
    label: "Technology",
    icon: Laptop2,
    description: "Tech meetups, hackathons, and developer conferences",
  },
  {
    id: "music",
    label: "Music",
    icon: Music2,
    description: "Concerts, festivals, and live performances",
  },
  {
    id: "sports",
    label: "Sports",
    icon: Dumbbell,
    description: "Sports events, tournaments, and fitness activities",
  },
  {
    id: "art",
    label: "Art & Culture",
    icon: Palette,
    description: "Art exhibitions, cultural events, and creative workshops",
  },
  {
    id: "food",
    label: "Food & Drink",
    icon: Pizza,
    description: "Food festivals, cooking classes, and culinary experiences",
  },
  {
    id: "business",
    label: "Business",
    icon: ShoppingCart,
    description: "Networking events, conferences, and startup meetups",
  },
  {
    id: "health",
    label: "Health & Wellness",
    icon: HeartPulse,
    description: "Yoga, meditation, wellness workshops, and health seminars",
  },
  {
    id: "education",
    label: "Education",
    icon: BookOpen,
    description: "Workshops, seminars, and learning experiences",
  },
  {
    id: "gaming",
    label: "Gaming",
    icon: Gamepad2,
    description: "Gaming tournaments, esports, and gaming conventions",
  },
  {
    id: "networking",
    label: "Networking",
    icon: Handshake,
    description: "Professional networking and community building events",
  },
  {
    id: "outdoor",
    label: "Outdoor & Adventure",
    icon: Tent,
    description: "Hiking, camping, and outdoor activities",
  },
  {
    id: "community",
    label: "Community",
    icon: Users,
    description: "Local community gatherings and social events",
  },
];

export const getCategoryById = (id: string) => {
  return CATEGORIES.find((cat) => cat.id === id);
};

export const getCategoryLabel = (id: string) => {
  const category = getCategoryById(id);
  return category ? category.label : id;
};

export const getCategoryIcon = (id: string) => {
  const category = getCategoryById(id);
  return category ? category.icon : MenuSquare;
};