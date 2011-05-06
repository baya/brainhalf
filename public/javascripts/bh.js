var BrainHalf = {

    booksAtCol: [],

    bookSources: {},

    ccInit: function(book_sources){
        this.bookSources = book_sources;
        this.checkFragment();
        this.checkCols();
        this.bookXInit();
        $(".colbutt").click(function(){
            var book_sid = $(this).attr("id").replace("colbutt-", '');
            if(BrainHalf.bookAdded(book_sid))
                return;
            var $blank_col = BrainHalf.getBlankCol($('.bh_col'));
            if($blank_col){
                var book = BrainHalf.getBookBySid(book_sid);
                BrainHalf.padColByBook($blank_col, book);
                $(this).addClass('nor-title');
                $(this).find("em").text("已经在对比栏中");
            } else {
                if(!$(this).hasClass('nor-title'))
                  alert('对比栏已满');
            }
        })
    },

    markFragment: function(){
        var fragment = this.booksAtCol.join(',');
        if(!fragment)
           return
        window.location.hash = '#bh|' + fragment;
    },

    padColByBook: function($blank_col, book){
        var book_pad_html = BrainHalf.getBookPadHtml(book);
        $blank_col.attr("padded", "padded");
        $blank_col.html(book_pad_html);
        BrainHalf.bookXInit();
        BrainHalf.addBookToCol(book.subject_id);
        if(BrainHalf.bookColsFulled())
            $('.c-btn').removeAttr('disabled');
    },

    getBookBySid: function(sid){
        return(this.bookSources[sid]);
    },

    getBookSidsByFragment: function(fragment){
        fragment = fragment.replace(/\s/g, '');
        var cap = fragment.match(/#bh\|(\d+,?.*)/);
        if(!cap)
            return [];
        var book_sids = cap[1].split(',');
        return book_sids;
    },

    checkFragment: function(){
        var fragment = window.location.hash;
        if(!fragment)
            return
        var book_sids = this.getBookSidsByFragment(fragment);
        if(book_sids.length == 0)
            return
        for(var i = 0; i < book_sids.length; i++){
            var book = this.getBookBySid(book_sids[i]);
            if(book){
                var $blank_col = BrainHalf.getBlankCol($('.bh_col'));
                this.padColByBook($blank_col, book);
            }
        }
    },

    checkCols: function(){
        $('.bh_col').each(function(index, item){
            var book_sid = $(item).children('input').val();
            if(book_sid){
                var $colbutt = $('#colbutt-' + book_sid);
                BrainHalf.addBookToCol(book_sid);
                $colbutt.find('em').text('已经在对比栏中');
                $colbutt.addClass('nor-title');
            }
        })
    },

    bookColsFulled: function(){
        return(this.booksAtCol.length >= 2);
    },

    clearBooksAtCol: function(){
        this.booksAtCol = [];
        this.markFragment();
    },

    bookAdded: function(book_sid){
        return($.inArray(book_sid, this.booksAtCol) != -1)
    },

    addBookToCol: function(book_sid){
        if($.inArray(book_sid, this.booksAtCol) == -1){
            this.booksAtCol.unshift(book_sid);
            this.markFragment();
        }
    },

    removeBookFromCol: function(book_sid){
        var i = this.booksAtCol.indexOf(book_sid);
        if(i == -1)
            return;
        this.booksAtCol.splice(i, 1);
        this.markFragment();
    },

    bookXInit: function(){
        $(".book_x").click(function(){
            var book_pad_html = '<dt><img src="/images/book-default-small.gif"/></dt><dd><span>选择一本书</span></dd>';
            var $pp = $(this).parent().parent();
            var book_sid = $pp.find('input').val();
            var $add_col = $('#colbutt-' + book_sid);
            $pp.attr("padded", null);
            $pp.html(book_pad_html);
            $('.c-btn').attr('disabled', true);
            BrainHalf.removeBookFromCol(book_sid);
            $add_col.removeClass('nor-title');
            $add_col.find("em").text("放入对比栏");
        });
    },

    getBlankCol: function($cols){
        for(var i = 0; i < $cols.length; i ++){
            var $bh_col = $($cols[i]);
            if($bh_col.attr("padded") != "padded")
              return($bh_col)
        }
    },

    getBookPadHtml: function(book){
        var book_pad_html = '<input name="bh_books[]" type="hidden" value="' + book.subject_id + '">' +
            '<dt>' +
            '<a href="' + book.alt_link + '">' +
            '<img src="' + book.image_link + '">' +
            '</a>' +
            '</dt>' +
            '<dd>' +
            '<a href="' + book.alt_link + '">' + book.name + '</a>' +
            '<span class="book_x">X</span>' +
            '</dd>';
        return book_pad_html;
    }

};