export const config = {
  api: {
    externalResolver: true,
  },
};

export default function handler(req, res) {
  console.log("???");
  console.log("message: ", req.query);
  res.end();
}