const PLANET_DATA = {
    sun: {
        name: "Sun",
        radius: 8,
        color: 0xFDB813, // Bright golden yellow - the Sun's actual appearance
        position: { x: 0, y: 0, z: 0 },
        description: "The Sun is the star at the center of our Solar System. It's a massive ball of hot plasma that provides light and heat to all planets.",
        stats: "Mass: 1.989 × 10³⁰ kg | Radius: 696,340 km | Surface Temperature: 5,778 K"
    },
    mercury: {
        name: "Mercury",
        radius: 1.2,
        color: 0x9C9C9C, // Dark grayish color - Mercury's actual rocky surface
        distance: 15,
        speed: 0.02,
        rotationSpeed: 0.01,
        description: "Mercury is the smallest planet and closest to the Sun. It has extreme temperature variations.",
        stats: "Distance from Sun: 57.9 million km | Day: 59 Earth days | Year: 88 Earth days"
    },
    venus: {
        name: "Venus",
        radius: 1.8,
        color: 0xFFC649, // Pale yellowish-orange - Venus's thick sulfuric acid clouds
        distance: 22,
        speed: 0.015,
        rotationSpeed: 0.008,
        description: "Venus is the hottest planet with a thick, toxic atmosphere. It rotates backwards compared to most planets.",
        stats: "Distance from Sun: 108.2 million km | Day: 243 Earth days | Year: 225 Earth days"
    },
    earth: {
        name: "Earth",
        radius: 2,
        color: 0x6B93D6, // Blue with hints of green and white - Earth's oceans and continents
        distance: 30,
        speed: 0.01,
        rotationSpeed: 0.02,
        description: "Earth is our home planet, the only known planet with life. It has liquid water and a protective atmosphere.",
        stats: "Distance from Sun: 149.6 million km | Day: 24 hours | Year: 365.25 days"
    },
    mars: {
        name: "Mars",
        radius: 1.5,
        color: 0xC1440E, // Rusty red-orange - Mars's iron oxide surface
        distance: 40,
        speed: 0.008,
        rotationSpeed: 0.018,
        description: "Mars is known as the Red Planet due to iron oxide on its surface. It has the largest volcano in the solar system.",
        stats: "Distance from Sun: 227.9 million km | Day: 24.6 hours | Year: 687 Earth days"
    },
    jupiter: {
        name: "Jupiter",
        radius: 4,
        color: 0xD8CA9D, // Cream and tan bands - Jupiter's cloud bands
        distance: 55,
        speed: 0.005,
        rotationSpeed: 0.04,
        description: "Jupiter is the largest planet, a gas giant with a Great Red Spot storm and over 80 moons.",
        stats: "Distance from Sun: 778.5 million km | Day: 9.9 hours | Year: 12 Earth years"
    },
    saturn: {
        name: "Saturn",
        radius: 3.5,
        color: 0xFAD5A5, // Pale gold/cream - Saturn's ammonia crystal clouds
        distance: 70,
        speed: 0.003,
        rotationSpeed: 0.038,
        description: "Saturn is famous for its prominent ring system. It's less dense than water and has 83 confirmed moons.",
        stats: "Distance from Sun: 1.432 billion km | Day: 10.7 hours | Year: 29 Earth years"
    },
    uranus: {
        name: "Uranus",
        radius: 2.8,
        color: 0x4FD0E3, // Pale cyan-blue - Uranus's methane atmosphere
        distance: 85,
        speed: 0.002,
        rotationSpeed: 0.03,
        description: "Uranus rotates on its side and is an ice giant with a faint ring system and 27 known moons.",
        stats: "Distance from Sun: 2.867 billion km | Day: 17.2 hours | Year: 84 Earth years"
    },
    neptune: {
        name: "Neptune",
        radius: 2.7,
        color: 0x4B70DD, // Deep blue - Neptune's methane-rich atmosphere
        distance: 100,
        speed: 0.001,
        rotationSpeed: 0.032,
        description: "Neptune is the windiest planet with speeds up to 2,100 km/h. It's the farthest planet from the Sun.",
        stats: "Distance from Sun: 4.515 billion km | Day: 16.1 hours | Year: 165 Earth years"
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PLANET_DATA;
}