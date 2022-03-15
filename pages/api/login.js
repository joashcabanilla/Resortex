import cookie from "cookie";

export default (req, res) => {
    const type = req.body.type;
    const id = req.body.id;

    res.setHeader("Set-Cookie", [cookie.serialize("type", type,
        {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 60 * 60,
            path: "/",
        }),
    cookie.serialize("id", id,
        {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 60 * 60,
            path: "/",
        })]
    );
    res.statusCode = 200;
    res.json({ success: true });
};