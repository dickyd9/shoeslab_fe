const getDetail = async () => {
await fetchWrapper.get("user-list").then((res) => {
listUser.value = res.data as Users[]
})
}
