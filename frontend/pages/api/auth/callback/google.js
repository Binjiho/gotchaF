export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

export default async function handler(req, res) {
  const url = req.url;

  res.status(200).json({ message: "Hello from Next.js!" });
}
