export function setupInfiniteScroll(scrollFunction) {
  let loading = false;

  function loadMoreItems() {
    if (loading) {
      return;
    }

    const scrollContainer = document.getElementById("scrollContainer");
    const scrollHeight = scrollContainer.scrollHeight;
    const scrollTop = scrollContainer.scrollTop;
    const clientHeight = scrollContainer.clientHeight;

    if (scrollTop + clientHeight >= scrollHeight - 20) {
      loading = true;

      if (scrollFunction) {
        scrollFunction();
      }
    }
  }

  const scrollContainer = document.getElementById("scrollContainer");
  scrollContainer.addEventListener("scroll", loadMoreItems);

  document.addEventListener("DOMContentLoaded", loadMoreItems);
}
