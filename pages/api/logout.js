import cookie from "cookie";

export default (req, res) => {
    const type = req.body.type;
    const id = req.body.id;

    res.setHeader("Set-Cookie", [cookie.serialize("type", "",
        {
            httpOnly: true,
            sameSite: "strict",
            expires: new Date(0),
            path: "/",
        }),
    cookie.serialize("id", "",
        {
            httpOnly: true,
            sameSite: "strict",
            expires: new Date(0),
            path: "/",
        })]
    );
    res.statusCode = 200;
    res.json({ success: true });
};