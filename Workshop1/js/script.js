
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

    //中文語系
    kendo.culture("zh-TW");

    //新增書籍視窗
    $("#add_book").click(function () {
        $("#add_window").data("kendoWindow").center().open();
    });
    $("#add_window").kendoWindow({
        width: "600",
        title: "新增書籍",
        visible: false,
        actions: [
            "Pin",
            "Minimize",
            "Maximize",
            "Close"
        ],
    });
    //圖書類別
    $("#book_category").kendoDropDownList({
        dataTextField: "text",
        dataValueField: "value",
        dataSource: bookCategoryList,
        index: 0,
        change: function (e) {
            var imageSrc = '';
            bookCategoryList.forEach(function (item, index, array) {
                if (item.value === $("#book_category").val()) {
                    imageSrc = item.src;
                }
                $("#book-image").attr('src', imageSrc);
            });
        }
    });
    //購買日期
    $("#bought_datepicker").kendoDatePicker({
        format: 'yyyy-MM-dd',
        value: new Date(),
        change:
            function (e) {
                $("#delivered_datepicker").kendoDatePicker().data("kendoDatePicker").min(this.value());
            }
    });
    //送達日期
    $("#delivered_datepicker").kendoDatePicker({
        format: 'yyyy-MM-dd',
        min: kendo.toString($("#bought_datepicker").data("kendoDatePicker").value(), 'd'),
    });
    //金額
    var bookPrice = 0, bookAmount = 0, bookTotal = 0, deleteDataKey;;
    $("#book_price").kendoNumericTextBox({
        format: "{0:N0}",
        change: function () {
            bookPrice = Math.round(this.value());
            bookTotal = bookPrice * bookAmount;
            $("#book_total").text(kendo.toString(bookTotal, "n0"));
        }
    });
    //數量
    $("#book_amount").kendoNumericTextBox({
        format: "{0:N0}",
        change: function () {
            bookAmount = Math.round(this.value());
            bookTotal = bookPrice * bookAmount;
            $("#book_total").text(kendo.toString(bookTotal, "n0"));
        }
    });


    //書籍總覽
    $("#book_grid").kendoGrid({
        dataSource: {
            data: bookDataFromLocalStorage,
            pageSize: 20,
        },
        height: 600,
        toolbar: kendo.template($("#template").html()),
        sortable: true,
        pageable: {
            input: true,
            numeric: false
        },
        columns: [{
            command: {
                text: "刪除", click: function (e) {
                    e.preventDefault();
                    var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                    deleteDataKey = dataItem.BookId;
                    deleteDialog.content("確定刪除 " + dataItem.BookName + " 嗎?");
                    deleteDialog.open();
                }
            }
        }, {
            field: "BookId",
            title: "書籍編號",
            type: "number"
        }, {
            field: "BookName",
            title: "書籍名稱",
            type: "string"
        }, {
            field: "BookCategory",
            title: "書籍種類",
            type: "string",
            template: function (e) {
                var bookcategoryText = "";
                bookCategoryList.forEach(function (item, index, array) {
                    if (item.value === e.BookCategory) {
                        bookcategoryText = item.text;
                    }
                })
                return bookcategoryText;
            }
        }, {
            field: "BookAuthor",
            title: "作者",
            type: "string"
        }, {
            field: "BookBoughtDate",
            title: "購買日期",
            type: "date",
            format: "{0:yyyy-MM-dd}"
        }, {
            field: "BookDeliveredDate",
            title: "送達狀態",
            type: "date",
            format: "{0:yyyy-MM-dd}",
            template: "#if (BookDeliveredDate !=null){#" +
                "<i class='fas fa-truck' title='#: kendo.toString(BookDeliveredDate, 'yyyy-MM-dd') #'></i>" +
                "#}#"
        }, {
            field: "BookPrice",
            title: "金額",
            type: "number",
            format: "{0:N0}元",
            attributes: { style: "text-align:right" }
        }, {
            field: "BookAmount",
            title: "數量",
            type: "number",
            format: "{0:N0}",
            attributes: { style: "text-align:right" }
        }, {
            field: "BookTotal",
            title: "總計",
            type: "number",
            format: "{0:N0}元",
            attributes: { style: "text-align:right" }

        }]
    });



    //搜尋
    $('#search').on('input', function (e) {
        var grid = $('#book_grid').data('kendoGrid');
        var columns = grid.columns;
        var filter = { logic: 'or', filters: [] };
        columns.forEach(function (x) {
            if (x.field) {
                var type = grid.dataSource.options.schema.model.fields[x.field].type;
                if (type == 'string') {
                    filter.filters.push({
                        field: x.field,
                        operator: 'contains',
                        value: e.target.value
                    })
                }
            }
        });
        grid.dataSource.filter(filter);
    });



    //刪除視窗
    var deleteDialog = $("#delete_details").kendoDialog({
        modal: false,
        visible: false,
        resizable: false,
        title: false,
        actions: [
            {
                text: 'OK', action: function (e) {
                    for (var key in bookDataFromLocalStorage) {
                        if (bookDataFromLocalStorage[key]["BookId"] == deleteDataKey) {
                            bookDataFromLocalStorage.splice(key, 1);
                        }
                    }
                    localStorage.setItem('bookData', JSON.stringify(bookDataFromLocalStorage));
                    window.location.reload();
                },
                primary: true
            },
            { text: 'CANCEL' }
        ],
    }).data("kendoDialog");




    //新增書籍以及驗證
    var validator = $("#book_form").kendoValidator().data("kendoValidator")
    $("#save_book").click(function () {
        if (validator.validate()) {
            var lastBookId = 0;
            bookDataFromLocalStorage.forEach(function (item, index, array) {
                if (item.BookId > lastBookId) {
                    lastBookId = item.BookId;
                }
            })
            var newBookData = {
                "BookId": lastBookId + 1,
                "BookCategory": $("#book_category").val(),
                "BookName": $("#book_name").val(),
                "BookAuthor": $("#book_author").val(),
                "BookBoughtDate": $("#bought_datepicker").val(),
                "BookPublisher": "",
                "BookDeliveredDate": $("#delivered_datepicker").val(),
                "BookPrice": parseInt($("#book_price").val(), 10),
                "BookAmount": parseInt($("#book_amount").val(), 10),
                "BookTotal": parseInt($("#book_price").val(), 10) * parseInt($("#book_amount").val(), 10)
            };
            bookDataFromLocalStorage.push(newBookData);
            localStorage.setItem('bookData', JSON.stringify(bookDataFromLocalStorage));
            $("#add_window").data("kendoWindow").close();
            window.location.reload();
        }
    });



});
