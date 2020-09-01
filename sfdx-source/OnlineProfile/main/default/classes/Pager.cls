/**
 * Pager
 */
public with sharing class Pager {
    private static final Integer MAX_SEARCH_OFFSET = 2000; // Maximum SOQL offset allowed is 2000

    public Boolean renderPrevLink { get; private set; }
    public Boolean renderNextLink { get; private set; }
    private final Integer searchLimit;
    private Integer searchOffset = 0;

    public Pager(Integer searchLimit) {
        this.searchLimit = searchLimit;
    }

    /** リセット */
    public Integer reset() {
        searchOffset = 0;
        return searchOffset;
    }

    /** 前へ */
    public Integer prev() {
        searchOffset -= searchLimit;
        if (searchOffset < 0) searchOffset = 0;
        return searchOffset;
    }

    /** 次へ */
    public Integer next() {
        searchOffset += searchLimit;
        if (searchOffset > MAX_SEARCH_OFFSET) {
            searchOffset = MAX_SEARCH_OFFSET;
        }
        return searchOffset;
    }

    /** リンク表示設定 */
    public void setRenderLink(String searchString, Integer resultSize) {
        renderPrevLink = (searchOffset > 0) ? true : false;
        // 検索条件未設定でも次へボタン有効化
        //if (String.isNotBlank(searchString) && resultSize > searchLimit) {
        if (resultSize > searchLimit) {
            renderNextLink = true;
        } else {
            renderNextLink = false;
        }
    }
}