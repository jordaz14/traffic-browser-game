const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: "http://localhost:5501" }));
app.use(express.json());

const postgres = require("postgres");
require("dotenv").config();

// DB CONNECTION
let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;
PGPASSWORD = decodeURIComponent(PGPASSWORD);

const sql = postgres({
  host: PGHOST,
  database: PGDATABASE,
  username: PGUSER,
  password: PGPASSWORD,
  port: 5432,
  ssl: "require",
  connection: {
    options: `project=${ENDPOINT_ID}`,
  },
});

async function getPgVersion() {
  const result = await sql`select version()`;
  console.log(result);
}

getPgVersion();

// ROUTE HANDLERS
app.get("/refresh-leaderboard/:partyId", async (req, res) => {
  try {
    const partyId = req.params.partyId;
    console.log(partyId);

    /*
    const party = await sql`
    SELECT party_id
    FROM party
    WHERE party_name = 'global'`;

    const partyId = party[0].party_id;
    */

    const leaderboard = await sql`
    SELECT username, score 
    FROM leaderboard 
    WHERE party_id = ${partyId} 
    ORDER BY score DESC`;

    res.json(leaderboard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/join-party", async (req, res) => {
  try {
    const { party } = req.body;

    const partyData = await sql`
    SELECT party_id
    FROM party
    WHERE party_name = ${party}`;

    if (partyData.length > 0) {
      console.log("result found!");
      console.log(partyData);
      const partyId = partyData[0].party_id;

      /*
      const leaderboard = await sql`SELECT username, score, party_id
      FROM leaderboard
      WHERE party_id = ${partyId}`;
      */
      res.json(partyId);
    } else {
      await sql`
      INSERT INTO party (party_name) VALUES (${party})`;
      res.status(201).json({ message: "Party successfully created" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred." });
  }
});

app.post("/submit-score", async (req, res) => {
  try {
    const { username, party, score } = req.body;
    console.log(username, party, score);

    const partyData = await sql`
    SELECT party_id
    FROM party
    WHERE party_name = ${party}`;

    const partyId = partyData[0].party_id;

    await sql`
    INSERT INTO leaderboard (username, party_id, score)
    VALUES (${username}, ${partyId}, ${score})`;

    res.status(201).json({ message: "User added successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred." });
  }
});

app.listen(PORT, () => {
  console.log("Server is running.");
});
