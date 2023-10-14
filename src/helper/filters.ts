const filters = {
  formatDate(dateString: any) {
    const date = new Date(dateString)
    // Then specify how you want your dates to be formatted
    return new Intl.DateTimeFormat("default", { dateStyle: "long" }).format(
      date
    )
  },
}
export default filters
