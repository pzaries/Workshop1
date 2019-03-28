
var bookDataFromLocalStorage = [];
var bookCategoryList = [
    { text: "資料庫", value: "database", src: "image/database.jpg" },
    { text: "網際網路", value: "internet", src: "image/internet.jpg" },
    { text: "應用系統整合", value: "system", src: "image/system.jpg" },
    { text: "家庭保健", value: "home", src: "image/home.jpg" },
    { text: "語言", value: "language", src: "image/language.jpg" }
];

// 載入書籍資料
function loadBookData() {
    bookDataFromLocalStorage = JSON.parse(localStorage.getItem('bookData'));
    if (bookDataFromLocalStorage == null) {
        bookDataFromLocalStorage = bookData;
        localStorage.setItem('bookData', JSON.stringify(bookDataFromLocalStorage));
    }
}

$(function () {
    loadBookData();
});

$(document).ready(function () {

    $("#add_window").hide();

    $("#add_book").click(function () {
        $("#add_window").data("kendoWindow").center().open();
    });


    $("#add_window").kendoWindow({
        width: "600px",
        title: "About Alvar Aalto",
        visible: false,
        actions: [
            "Pin",
            "Minimize",
            "Maximize",
            "Close"
        ],
    });

    $("#add_book").click(function () {
        $("#add_window").show();
    });

    $("#book_grid").kendoGrid({
        dataSource: {
            data: bookDataFromLocalStorage,
            pageSize: 20
        },
        height: 550,
        scrollable: true,
        sortable: true,
        filterable: true,
        pageable: {
        input: true,
        numeric: false
        },
        columns: [
            "bookDataFromLocalStorage",
            { field: "BookId", title: "書籍編號",  width: "130px" },
            { field: "BookName", title: "書籍名稱", width: "130px" },
            { field: "BookCategory", title: "書籍種類",width: "130px" },
            { field: "BookAuthor", title: "作者", width: "130px" },
            { field: "BookBoughtDate", title: "購買日期", width: "130px" },
            { field: "BookDeliveredDate", title: "送達狀態", width: "130px" },
            { field: "BookPrice", title: "金額",width: "130px" },
            { field: "BookAmount", title: "數量",width: "130px" },
            { field: "BookTotal", title: "總計",width: "130px" },
        ]
    });
});
