$(document).ready(function() {
    $('input[type=radio][name=liste]').click(function() {
        var valeur = $(this).val(),
            fonction = $('#fonction').val(),
            id_user = $('#id_user').val();
        $('#btns-print').removeClass('d-none');
        $('#zone-recherche').show();

        if (valeur.includes("recense")) {
            setupRecensement(fonction, id_user);
        } else {
            handleTypeChange(valeur, id_user, fonction);
        }
    });
});

function setupRecensement(fonction, id_user) {
    $('input[type=search]').attr('id','rechercheRece');
    $('input[type=search]').val("");
    $('#input-group').removeClass('border-info');
    $('#headT').addClass('headrece').removeClass('headartisa headcommerce');
    recupRece(1, 18, fonction, id_user);
}

function recupRece(page, limit, fonction, id_user) {
    $.ajax({
        url : '/list/rece',
        type : 'get',
        data : { page: page, limit: limit, fonction: fonction, id_user: id_user },
        success : function(response){
            renderTableRece(response.data);
            renderPagination(page, limit, response.data.length, recupRece, [fonction, id_user]);
        },
        error: function() {
            alert('Error fetching data');
        }
    });
}

function renderTableRece(data) {
    var tableBody = $('#dataTable tbody'),
        tableHead = $('#dataTable thead');
    tableHead.html(`
        <tr>
            <th class='text-uppercase'>N°</th>
            <th class='text-uppercase'>Nom</th>
            <th class='text-uppercase'>Postnom</th>
            <th class='text-uppercase'>Prénom</th>
            <th class='text-uppercase'>Nature</th>
            <th class='text-uppercase'>Dénomination</th>
            <th class='text-uppercase'>Forme juridique</th>
            <th class='text-uppercase'>Tél</th>
            <th class='text-uppercase'>Sexe</th>
            <th class='text-uppercase'>AV. N° Act.</th>
            <th class='text-uppercase'>Quart. Act</th>
            <th class='text-uppercase'>Commune Act.</th>
            <th class='text-uppercase'>AV. N° Rés.</th>
            <th class='text-uppercase'>Quart. Rés</th>
            <th class='text-uppercase'>Commune Rés.</th>
            <th class='text-uppercase'>Type Rec.</th>
            <th class='text-uppercase'>Montant.</th>
            <th class='text-uppercase'>Photo.</th>
        </tr>
    `);
    tableBody.empty(); // Vider le tableau
    let i = 1;
    data.forEach(function(row) {
        tableBody.append(`
            <tr>
                <td>${i++}</td>
                <td>${row.nom}</td>
                <td>${row.postnom}</td>
                <td>${row.prenom}</td>
                <td>${row.nature}</td>
                <td>${row.denomination}</td>
                <td>${row.forme_juri}</td>
                <td>${row.tel}</td>
                <td>${row.sexe}</td>
                <td>${row.av_acti} ${row.num_acti}</td>
                <td>${row.quartier_acti}</td>
                <td>${row.commune_acti}</td>
                <td>${row.av_resi} ${row.num_resi}</td>
                <td>${row.quertier_resi}</td>
                <td>${row.commune_resi}</td>
                <td>${row.type_rece}</td>
                <td>${row.montant}</td>
                <td><img src='${row.photo}' class='img-fluid photo-click' width='60' height='60' alt='Photo' /></td>
            </tr>
        `);
    });
    $('#dataTable').show();
    setupImageModal();
}

function handleTypeChange(valeur, id_user, fonction) {
    var typePat, headerClass;
    if (valeur.includes("artisanale")) {
        typePat = $('#artisanale').val();
        headerClass = 'headartisa';
    } else if (valeur.includes("commercial")) {
        typePat = $('#commerce').val();
        headerClass = 'headcommerce';
    } else {
        return;
    }
    $('input[type=search]').attr('id', 'recherchePat').val("");
    $('#input-group').removeClass('border-info');
    setHeaderClass(headerClass);
    recupPat(typePat, 1, 10, id_user, fonction);
}

function recupPat(typePat, page, limit, id_user, fonction) {
    $.ajax({
        url: '/list/patente',
        type: 'get',
        data: { typePat: typePat, page: page, id_user: id_user, fonction: fonction },
        success: function(response) {
            renderTablePat(response.data);
            renderPagination(page, limit, response.data.length, recupPat, [typePat, id_user, fonction]);
        }
    });
}

function renderTablePat(data) {
    var tableBody = $('#dataTable tbody'),
        tableHead = $('#dataTable thead');
    tableHead.html(`
        <tr>
            <th class='text-uppercase'>N°</th>
            <th class='text-uppercase'>Nom</th>
            <th class='text-uppercase'>Nature</th>
            <th class='text-uppercase'>Dénomination</th>
            <th class='text-uppercase'>Tél</th>
            <th class='text-uppercase'>AV. N° Act.</th>
            <th class='text-uppercase'>Quart. Act.</th>
            <th class='text-uppercase'>Commune Act.</th>
            <th class='text-uppercase'>AV. N° Rés.</th>
            <th class='text-uppercase'>Quart. Rés.</th>
            <th class='text-uppercase'>Commune Rés.</th>
            <th class='text-uppercase'>Taux.</th>
            <th class='text-uppercase'>Pénalité.</th>
            <th class='text-uppercase'>Photo.</th>
        </tr>
    `);
    tableBody.empty(); // Vider le tableau
    let i = 1;
    data.forEach(function(row) {
        tableBody.append(`
            <tr>
                <td>${i++}</td>
                <td>${row.nom}</td>
                <td>${row.nature}</td>
                <td>${row.denomination}</td>
                <td>${row.tel}</td>
                <td>${row.av_actiP} ${row.num_actiP}</td>
                <td>${row.quertier_actP}</td>
                <td>${row.commune_actiP}</td>
                <td>${row.av_resiP} ${row.num_resiP}</td>
                <td>${row.quartier_resiP}</td>
                <td>${row.commune_resiP}</td>
                <td>${row.taux}</td>
                <td>${row.penalite}</td>
                <td><img src='${row.photo}' class='img-fluid photo-click' width='60' height='60' alt='Photo' /></td>
            </tr>
        `);
    });
    $('#dataTable').show();
    setupImageModal();
}

function setHeaderClass(headerClass) {
    $('#headT').removeClass('headartisa headrece headcommerce');
    $('#headT').addClass(headerClass);
}

function renderPagination(currentPage, limit, dataLength, fetchFunction, fetchArgs) {
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
        fetchFunction.apply(null, [page, limit].concat(fetchArgs));
    });
}

function setupImageModal() {
    $('.photo-click').click(function() {
        var src = $(this).attr('src');
        $('#modalImage').attr('src', src);
        $('#imageModal').modal('show');
    });
}

$('#rechercheRece').on('input', function() {
    var searchTerm = $(this).val().toLowerCase();
    $('#dataTable tbody tr').each(function() {
        var row = $(this);
        var rowText = row.text().toLowerCase();
        if (rowText.indexOf(searchTerm) === -1) {
            row.hide();
        } else {
            row.show();
        }
    });
});