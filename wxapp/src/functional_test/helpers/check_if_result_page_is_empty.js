async function check_if_result_page_is_empty(result_page) {
    const empty_search_result_elem = await result_page.$("view.no-result");
    if (empty_search_result_elem) {
        return true;
    }
    return false;
}

module.exports = check_if_result_page_is_empty;
