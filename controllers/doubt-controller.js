const getCreate = async (req, res) => {
    try {
        res
            .status(240)
            .end("Doubt Create Get Request Successfully");
    } catch (error) {
        console.log(error);
    }
}
const postCreate = async (req, res) => {
    try {
        res
            .status(240)
            .send("Doubt Create Post Request Successfully");
    } catch (error) {
        console.log(error);
    }
}

module.exports = {getCreate, postCreate}