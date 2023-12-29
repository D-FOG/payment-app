export default function handler(req, res) {
    console.log("from API")
    res.status(200).json({name: "doe"})
}