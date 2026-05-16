const teamMembers = [
    { name: "Kyle Barco", role: "Backend Developer (Lead)", imgUrl: 'https://avatars.githubusercontent.com/u/101305133?v=4' },
    { name: "Muzza Lacamento", role: "Frontend Developer", imgUrl: 'https://lh3.googleusercontent.com/a-/ALV-UjXPL6BPe0BElqrUIC_4cRhhzw3L8Rf_V2CjblknpC_QXsEqDCSIiQ=s240-p-k-rw-no' },
    { name: "Glynicel Vicente", role: "Database Administrator", imgUrl: 'https://lh3.googleusercontent.com/a-/ALV-UjW8c6TFRZYyDfbi8Rvv36TzyDVVGOBqDBd4qsa_LohwfXY4BHw=s240-p-k-rw-no'},
    { name: "Micah Guda", role: "UI/UX Designer & QA", imgUrl: ''  },
    { name: "Dave Llaguno", role: "Content & Documentation Specialist", imgUrl: 'resources/img/dave.jpg' }
];

exports.showTeam = async (req, res) => {
    try {
        // Renders your EJS file (e.g., 'org-chart.ejs') and injects the array
        res.render('team', { team: teamMembers });
    } catch (error) {
        console.error("Error rendering team chart:", error);
        res.status(500).send("Internal Server Error");
    }
};