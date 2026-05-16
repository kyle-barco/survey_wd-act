const teamMembers = [
    { name: "Kyle Barco", role: "Tech Lead" },
    { name: "Muzza Lacamento", role: "Front-End Developer" },
    { name: "Glynicel Vicente", role: "Database Administrator" },
    { name: "Micah Guda", role: "UI/UX Designer / QA" },
    { name: "Dave Llaguno", role: "Content & Documentation Specialist" }
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