const teamMembers = [
    { name: "Kyle Barco", role: "Backend Developer (Lead)", imgUrl: 'https://avatars.githubusercontent.com/u/101305133?v=4' },
    { name: "Muzza Lacamento", role: "Frontend Developer", imgUrl: 'img/muzza.jpg' },
    { name: "Glynicel Vicente", role: "Database Administrator", imgUrl: 'img/glynicel.jpg'},
    { name: "Micah Guda", role: "UI/UX Designer & QA", imgUrl: 'img/micah.jpg'  },
    { name: "Dave Llaguno", role: "Content & Documentation Specialist", imgUrl: 'img/dave.jpg' }
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