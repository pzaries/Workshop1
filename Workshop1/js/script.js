
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
function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function getBoolean(str) {
    if ("true".startsWith(str)) {
        return true;
    } else if ("false".startsWith(str)) {
        return false;
    } else {
        return null;
    }
}

$(document).ready(function () {
    kendo.culture("zh-TW");

    $("#add_book").click(function () {
        $("#add_window").data("kendoWindow").center().open();
    });
    $("#add_window").kendoWindow({
        width: "600px",
        title: "新增書籍",
        visible: false,
        actions: [
            "Pin",
            "Minimize",
            "Maximize",
            "Close"
        ],
    });


    $("#book_grid").kendoGrid({
        dataSource: {
            data: bookDataFromLocalStorage,
            pageSize: 20,
        },
        height: 700,
        sortable: true,
        toolbar: kendo.template($("#template").html()),
        pageable: {
            input: true,
            numeric: false
        },
        columns: [
            { command: [{ text: "刪除" }] },
            { field: "BookId", title: "書籍編號", type: "number"},
            { field: "BookName", title: "書籍名稱", type: "string"},
            { field: "BookCategory", title: "書籍種類", type: "string"},
            { field: "BookAuthor", title: "作者", type: "string"},
            { field: "BookBoughtDate", title: "購買日期", type: "string", format: "{0:yyyy-MM-dd}"},
            { field: "BookDeliveredDate", title: "送達狀態", type: "string", format: "{0:yyyy-MM-dd}"},
            { field: "BookPrice", title: "金額", type: "number", format: "{0:NO}元"},
            { field: "BookAmount", title: "數量", type: "number", format: "{0:NO}"},
            { field: "BookTotal", title: "總計", type: "number", format: "{0:NO}元"}
        ]
    });

    $("#search").on('input', function (e) {
        var grid = $('#book_grid').data('kendoGrid');
        var columns = grid.columns;
        var filter = { logic: 'or', filters: [] };
        columns.forEach(function (x) {
            if (x.field) {
                var type = grid.dataSource.options.schema.model.field[x.field].type;
                if (type == 'string') {
                    filter.filters.push({
                        field: x.field,
                        operator: 'contains',
                        value: e.target.value
                    })
                }
                else if (type == 'number') {
                    if (isNumeric(e.target.value)) {
                        filter.filters.push({
                            field: x.field,
                            operator: 'eq',
                            value: e.target.value
                        });
                    }

                } else if (type == 'date') {
                    var data = grid.dataSource.data();
                    for (var i = 0; i < data.length; i++) {
                        var dateStr = kendo.format(x.format, data[i][x.field]);
                        if (dateStr.startsWith(e.target.value)) {
                            filter.filters.push({
                                field: x.field,
                                operator: 'eq',
                                value: data[i][x.field]
                            })
                        }
                    }
                } else if (type == 'boolean' && getBoolean(e.target.value) !== null) {
                    var bool = getBoolean(e.target.value);
                    filter.filters.push({
                        field: x.field,
                        operator: 'eq',
                        value: bool
                    });
                }
            }
        });
        grid.dataSource.filter(filter);
    });



    //圖書類別
    $("#book_category").kendoDropDownList({
        dataTextField: "text",
        dataValueField: "value",
        dataSource: bookCategoryList,
        index: 0,
        // "image/"+"value"+".jpg"
    });
    //書名
    $("#book_name")
    //作者 $("#book_category")

});
