describe("BrainHalf", function(){

    var blank_col_html = '<dt><img src="/images/book-default-small.gif"/></dt><dd><span>选择一本书</span></dd>';
    var book_sources = {
            '2228378': {
                image_link:"http://img3.douban.com/spic/s2228378.jpg",
                name: "JavaScript权威指南",
                alt_link:"http://book.douban.com/subject/2228378",
                subject_id: "2228378"
            },
            '1869705': {
                image_link:"http://img3.douban.com/spic/s1888787.jpg",
                name:"JavaScript高级程序设计",
                alt_link:"http://book.douban.com/subject/188878",
                subject_id: "1869705"
            },
            '1767945':{
                image_link:'http://img3.douban.com/spic/s1670642.jpg',
                name: "一只特立独行的猪",
                alt_link:'http://book.douban.com/subject/1767945/',
                subject_id: '1767945'
            },
            '1082407':{
                image_link:'http://img3.douban.com/spic/s3939916.jpg',
                name:'青铜时代',
                alt_link:'http://book.douban.com/subject/1082407/',
                subject_id: '1082407'
            }
        }

    describe('验证BrainHalf的方法', function(){

        it(".getBookBySid", function(){
            BrainHalf.bookSources = book_sources;
            var book1 = BrainHalf.getBookBySid("2228378");
            expect(book1.subject_id).toEqual("2228378");
            var book2 = BrainHalf.getBookBySid("1869705");
            expect(book2.subject_id).toEqual("1869705");
        })

        it(".bookAdded, .addBookToCol, .removeBookFromCol", function(){
            BrainHalf.addBookToCol(1);
            BrainHalf.addBookToCol(2);
            BrainHalf.addBookToCol(2);
            expect(BrainHalf.bookAdded(1)).toBeTruthy();
            expect(BrainHalf.bookAdded(2)).toBeTruthy();
            expect(BrainHalf.bookAdded(100)).toBeFalsy();
            BrainHalf.removeBookFromCol(1)
            expect(BrainHalf.bookAdded(1)).toBeFalsy();
        })

        it("从锚点中获取书的sid", function(){
            var fragment = "#bh|123,1234,56";
            var book_sids = BrainHalf.getBookSidsByFragment(fragment);
            expect(book_sids).toEqual(['123', '1234', '56']);
            var fragment = "#bh|123";
            var book_sids = BrainHalf.getBookSidsByFragment(fragment);
            expect(book_sids).toEqual(['123']);
            var fragment = "###bh#bh|123, 1234, 56";
            var book_sids = BrainHalf.getBookSidsByFragment(fragment);
            expect(book_sids).toEqual(['123', '1234', '56']);
            var fragment = "###bh#";
            var book_sids = BrainHalf.getBookSidsByFragment(fragment);
            expect(book_sids).toEqual([]);
        })

        it(".getBookPadHtml获得书的image_link, alt_link, name, subject_id", function(){
            var $source = $('.colbutt').children('span');
            var book_pad_html = BrainHalf.getBookPadHtml($source);
            expect(book_pad_html).toMatch(/name="bh_books\[\]"/);
        })

    })


    describe('对比栏有两本书的夹具', function(){

        beforeEach(function(){
            loadFixtures("search_books.html");
            BrainHalf.clearBooksAtCol();
            BrainHalf.ccInit(book_sources);
        })

        it("从对比栏中移除一本书，当点击对应的书的移除按钮时", function(){
            var book_pad_html = blank_col_html;
            var $book_x = $(".book_x");
            $book_x.each(function(index, item){
                var cc = $(item).parent().parent();
                $(item).click();
                expect(cc).toHaveHtml(book_pad_html);
            })
        })

        it("从对比栏中移除一本书时，对比按钮不可用", function(){
            var $left_book_x = $($(".book_x")[0]);
            $left_book_x.click();
            expect($(".c-btn")).toBeDisabled();
        })

        it("对比栏的左栏空白，当点击'放入对比栏'时，左栏将填上一本书", function(){
            clearColumn(0);
            var $l_col = $($(".bh_col")[0]);
            var $ccbtn = $('.colbutt');
            var $cb = $($ccbtn[2]);
            var book_sid = $cb.attr("id").replace("colbutt-", '');
            var book = BrainHalf.getBookBySid(book_sid);
            var book_pad_html = BrainHalf.getBookPadHtml(book);
            $cb.click();
            expect($l_col).toHaveHtml(book_pad_html);
        })

        it("对比栏里的右栏空白，左栏有书，当点击'放入对比栏'时，右栏将填上一本书，左栏不变", function(){
            padColumn(0);
            clearColumn(1);
            window.location.hash = '';
            var $ccbtn = $('.colbutt');
            var $cb = $($ccbtn[1]);
            var book_sid = $cb.attr('id').replace('colbutt-', '');
            var book = BrainHalf.getBookBySid(book_sid);
            var $l_col = $($(".bh_col")[0]);
            var $r_col = $($(".bh_col")[1]);
            var book_pad_html = BrainHalf.getBookPadHtml(book);
            $cb.click();
            expect($r_col).toHaveHtml(book_pad_html);
            expect($l_col).not.toHaveHtml(book_pad_html);
        })

        it("对比栏里的两栏都是空白，当点击'放入对比栏'时，左栏将填上一本书，右栏仍然空白", function(){
            clearColumn(0);
            clearColumn(1);
            var $ccbtn = $('.colbutt');
            var $cb = $($ccbtn[1]);
            var book_sid = $cb.attr('id').replace('colbutt-', '');
            var book = BrainHalf.getBookBySid(book_sid);
            var $l_col = $($(".bh_col")[0]);
            var $r_col = $($(".bh_col")[1]);
            var book_pad_html = BrainHalf.getBookPadHtml(book);
            $cb.click();
            expect($l_col).toHaveHtml(book_pad_html);
            expect($r_col).not.toHaveHtml(book_pad_html);
        })

        it("从书列表中填一本书后，此书的移除按钮仍然有效", function(){
            clearColumn(0);
            clearColumn(1);
            var book_pad_html = blank_col_html;
            var $ccbtn = $('.colbutt');
            $('.colbutt').click();
            var $book_x = $(".book_x");
            $book_x.each(function(index, item){
                var cc = $(item).parent().parent();
                $(item).click();
                expect(cc).toHaveHtml(book_pad_html);
            })
        })

        it("将书添加到对比栏后，此书的‘放入对比栏’会变成‘已经在对比栏中’", function(){
            clearColumn(0);
            clearColumn(1);
            var $ct = $($('.colbutt')[0]);
            $ct.click();
            expect($ct).toHaveClass('nor-title');
            expect($ct).toHaveText(/已经在对比栏中/);
        })

        it("将书添加到对比栏后，点击‘已经在对比栏中’，对比栏的内容没有变化", function(){
            clearColumn(0);
            clearColumn(1);
            var $l_col = $($(".bh_col")[0]);
            var $r_col = $($(".bh_col")[1]);
            var $ct = $($('.colbutt')[0]);
            $ct.click();
            $ct.click();
            $ct.click();
            expect($r_col.attr("padded")).not.toEqual('padded');
        })

        it("将书从对比栏中移除后，此书的‘放入对比栏’功能启动", function(){
            padColumn(0);
            padColumn(1);
            $('.book_x').each(function(index, item){
                var book_sid = $(item).parent().parent().find("input").val();
                var $add_col = $('#colbutt-' + book_sid);
                $(item).click();
                expect($add_col.attr('class')).toEqual('colbutt');
                expect($add_col).toHaveText(/放入对比栏/);
                $add_col.click();
                var $pp = $($('.bh_col')[index]);
                expect($pp.attr("padded")).toEqual("padded");
            })
        })

        it("加载页面时，检查对比栏中是否有书", function(){
            $('.bh_col').each(function(index, item){
                var book_sid = $(item).children('input').val();
                var $colbutt = $('#colbutt-' + book_sid);
                expect(BrainHalf.bookAdded(book_sid)).toBeTruthy();
                expect($colbutt).toHaveText(/已经在对比栏中/);
                expect($colbutt).toHaveClass('nor-title');
            })
        })

        it("如果对比栏满了，那么‘开始对比’按钮生效", function(){
            $('.book_x').click();
            $($('.colbutt')[0]).click();
            $($('.colbutt')[1]).click();
            expect($('.c-btn')).not.toBeDisabled();
        })

        afterEach(function(){
            window.location.hash = '';
        })

    })


    describe('对比栏里没有书的夹具', function(){

        beforeEach(function(){
            loadFixtures("blank_cols.html");
            window.location.hash = '';
            BrainHalf.clearBooksAtCol();
        })

        describe('从url中的锚点获取要比较的书的sid，将书添加到对比栏中', function(){

            it("从url中的锚点含有两个sid", function(){
                window.location = window.location + "#bh|1767945,1082407";
                BrainHalf.ccInit(book_sources);
                $('.bh_col').each(function(index, item){
                    expect($(item).attr('padded')).toEqual('padded');
                })
            })

            it("从url中的锚点含有一个sid", function(){
                window.location = window.location + "#bh|1767945";
                BrainHalf.ccInit(book_sources);
                var $colbut = $('#colbutt-' + '1767945');
                expect($colbut.find('em').text()).toEqual('已经在对比栏中');
            })

            afterEach(function(){
                window.location.hash = '';
            })

        })

        it("添加一本书到对比栏后，url将增加该书的sid锚点", function(){
            BrainHalf.ccInit(book_sources);
            var $colbut0 = $($('.colbutt')[0]);
            $colbut0.click();
            var book_sid = $colbut0.attr("id").replace('colbutt-', '');
            expect(window.location.hash).toMatch(book_sid);
        })

    })

    function clearColumn(index){
        var $col = $($(".bh_col")[index]);
        var book_sid = $col.children('input').val();
        BrainHalf.removeBookFromCol(book_sid);
        $col.attr("padded", null);
        $col.html(blank_col_html);
    }

    function padColumn(index){
        var $col = $($(".bh_col")[index]);
        var book_sid = $col.children('input').val();
        BrainHalf.addBookToCol(book_sid);
        $col.attr("padded", "padded");
    }

})
