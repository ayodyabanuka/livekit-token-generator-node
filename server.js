import express from 'express';
import { AccessToken } from 'livekit-server-sdk';
import cors from 'cors';

const API_KEY = 'API2pd5X7wjefkM';
const API_SECRET = 'BK5UjbcxyeRd5Nje64eHeIlOoq2Hlqf4R6uPjDuvB9uB';

const createToken = async (roomName, participantName) => {
  try {
    const at = new AccessToken(API_KEY, API_SECRET, {
      identity: participantName,
      ttl: 2400, //(40 minutes)
    });
    at.addGrant({ roomJoin: true, room: roomName });

    return at.toJwt();
  } catch (error) {
    console.error('Error creating token:', error);
    throw new Error('Token generation failed');
  }
};

const app = express();
const port = 3001;
app.use(cors());
app.get('/getToken', async (req, res) => {
  const { room, user } = req.query;

  if (!room || !user) {
    return res.status(400).send('Room and User are required');
  }

  try {
    const token = await createToken(room, user);
    res.send({ token });
  } catch (error) {
    res.status(500).send('Error generating token');
  }
});
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
