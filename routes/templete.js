// Pagination function
const getPaginatedData = (page, limit) => {
    const offset = (page - 1) * limit;
    const query = `SELECT * FROM your_table_name LIMIT ${limit} OFFSET ${offset}`;
    
    return new Promise((resolve, reject) => {
        connection.query(query, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

// Route pour récupérer les données avec pagination
router.get('/data', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    try {
        const data = await getPaginatedData(page, limit);
        res.json({ data: data, page: page, limit: limit });
    } catch (err) {
        res.status(500).send('Error fetching data');
    }
});

module.exports = router;


{/* <button id="loadData" class="btn btn-primary mt-4">Load Data</button>
        <table id="dataTable" class="table table-striped table-bordered mt-4" style="display: none;">
            <thead class="thead-dark">
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                </tr>
            </thead>
            <tbody>
                <!-- Les données seront insérées ici -->
            </tbody>
        </table>

        <nav>
            <ul class="pagination justify-content-center" id="pagination" style="display: none;">
                <!-- Les éléments de pagination seront insérés ici -->
            </ul>
        </nav>
    </div>

    <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
    <script>
        $(document).ready(function() {
            $('#loadData').click(function() {
                loadData(1, 10); // Charger la première page avec 10 éléments par page
            });

            function loadData(page, limit) {
                $.ajax({
                    url: '/list/data',
                    method: 'GET',
                    data: { page: page, limit: limit },
                    success: function(response) {
                        renderTable(response.data);
                        renderPagination(response.page, response.limit, response.data.length);
                    },
                    error: function() {
                        alert('Error fetching data');
                    }
                });
            }

            function renderTable(data) {
                var tableBody = $('#dataTable tbody');
                tableBody.empty(); // Vider le tableau
                data.forEach(function(row) {
                    tableBody.append(`
                        <tr>
                            <td>${row.id}</td>
                            <td>${row.name}</td>
                            <td>${row.email}</td>
                        </tr>
                    `);
                });
                $('#dataTable').show();
            }

            function renderPagination(currentPage, limit, dataLength) {
                var pagination = $('#pagination');
                pagination.empty(); // Vider la pagination

                if (currentPage > 1) {
                    pagination.append(`
                        <li class="page-item">
                            <a class="page-link" href="#" data-page="${currentPage - 1}">Previous</a>
                        </li>
                    `);
                }

                pagination.append(`
                    <li class="page-item active">
                        <a class="page-link" href="#" data-page="${currentPage}">${currentPage}</a>
                    </li>
                `);

                if (dataLength === limit) {
                    pagination.append(`
                        <li class="page-item">
                            <a class="page-link" href="#" data-page="${currentPage + 1}">Next</a>
                        </li>
                    `);
                }

                $('#pagination').show();

                // Ajouter des gestionnaires d'événements pour les liens de pagination
                $('#pagination a').click(function(e) {
                    e.preventDefault();
                    var page = $(this).data('page');
                    loadData(page, limit);
                });
            }
        });
    </script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</body> */}