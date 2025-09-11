// Initialize DataTable
let dataTable = $('#resultsTable').DataTable({
    responsive: true,
    pageLength: 10,
    columns: [
        { data: 'techId' },
        { data: 'startTime' },
        { data: 'endTime' },
        { data: 'restaurant' },
        { data: 'interventionType' },
        { data: 'motif' },
        { data: 'description' },
        { data: 'taxi' },
        { data: 'train' },
        { data: 'meals' },
        { data: 'hotel' },
        { data: 'otherCosts' },
        { data: 'total' }
    ]
});

// Handle form submission
document.getElementById('filterForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    await fetchAndDisplayData();
});

// Auto-fill technician name when ID is entered
document.getElementById('techId').addEventListener('change', async (e) => {
    const techId = e.target.value;
    if (techId) {
        const techName = await fetchTechnicianName(techId);
        document.getElementById('techName').value = techName;
    }
});

// Auto-fill technician ID when name is entered
document.getElementById('techName').addEventListener('change', async (e) => {
    const techName = e.target.value;
    if (techName) {
        const techId = await fetchTechnicianId(techName);
        document.getElementById('techId').value = techId;
    }
});

// Fetch and display data
async function fetchAndDisplayData() {
    const filters = {
        techId: document.getElementById('techId').value,
        startDate: document.getElementById('startDate').value,
        endDate: document.getElementById('endDate').value
    };

    try {
        // Replace this with actual API call to Google Sheets
        const data = await fetchDataFromGoogleSheets(filters);
        dataTable.clear().rows.add(data).draw();
    } catch (error) {
        console.error('Error fetching data:', error);
        alert('Error fetching data. Please try again.');
    }
}

// Export Mission Order PDF
document.getElementById('exportMission').addEventListener('click', () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    const techId = document.getElementById('techId').value;
    const techName = document.getElementById('techName').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    // Add header
    doc.setFontSize(20);
    doc.text('Mission Order', 105, 20, { align: 'center' });
    
    // Add technician info
    doc.setFontSize(12);
    doc.text(`Technician ID: ${techId}`, 20, 40);
    doc.text(`Technician Name: ${techName}`, 20, 50);
    doc.text(`Period: ${startDate} to ${endDate}`, 20, 60);

    // Add table
    const tableData = dataTable.data().toArray();
    doc.autoTable({
        startY: 70,
        head: [['Date', 'Type', 'Description', 'Total']],
        body: tableData.map(row => [
            row.startTime,
            row.interventionType,
            row.description,
            row.total
        ])
    });

    doc.save('mission-order.pdf');
});

// Export Expense Report PDF
document.getElementById('exportExpense').addEventListener('click', () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    const techId = document.getElementById('techId').value;
    const techName = document.getElementById('techName').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    // Add header
    doc.setFontSize(20);
    doc.text('Expense Report', 105, 20, { align: 'center' });
    
    // Add technician info
    doc.setFontSize(12);
    doc.text(`Technician ID: ${techId}`, 20, 40);
    doc.text(`Technician Name: ${techName}`, 20, 50);
    doc.text(`Period: ${startDate} to ${endDate}`, 20, 60);

    // Calculate totals
    const tableData = dataTable.data().toArray();
    const totals = tableData.reduce((acc, row) => ({
        taxi: acc.taxi + parseFloat(row.taxi || 0),
        train: acc.train + parseFloat(row.train || 0),
        meals: acc.meals + parseFloat(row.meals || 0),
        hotel: acc.hotel + parseFloat(row.hotel || 0),
        other: acc.other + parseFloat(row.otherCosts || 0),
        total: acc.total + parseFloat(row.total || 0)
    }), { taxi: 0, train: 0, meals: 0, hotel: 0, other: 0, total: 0 });

    // Add expense table
    doc.autoTable({
        startY: 70,
        head: [['Category', 'Amount']],
        body: [
            ['Taxi', totals.taxi.toFixed(2)],
            ['Train', totals.train.toFixed(2)],
            ['Meals', totals.meals.toFixed(2)],
            ['Hotel', totals.hotel.toFixed(2)],
            ['Other Costs', totals.other.toFixed(2)],
            ['Total', totals.total.toFixed(2)]
        ]
    });

    doc.save('expense-report.pdf');
});

// Helper function to fetch data from Google Sheets
async function fetchDataFromGoogleSheets(filters) {
    // TODO: Implement actual Google Sheets API integration
    // This is a placeholder that should be replaced with actual API calls
    return [];
}

// Helper functions to fetch technician details
async function fetchTechnicianName(techId) {
    // TODO: Implement actual API call to fetch technician name
    return '';
}

async function fetchTechnicianId(techName) {
    // TODO: Implement actual API call to fetch technician ID
    return '';
}