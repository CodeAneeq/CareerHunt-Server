import express from 'express';
import connectDB from './db/connect_db.js';
import Constants from './constant.js';
import userRoutes from  './routes/user-routes.js'
import companyRoutes from  './routes/company-routes.js'
import jobRoutes from  './routes/job-routes.js'
import applicationRoutes from  './routes/application-routes.js'
import cors from 'cors'

const app = express();
app.use(cors({
  origin: 'https://careeerhunt.netlify.app'  // <-- frontend URL sahi likho yahan
}));
app.use(express.json());
connectDB(Constants.DB_URI);
app.use('/user/api', userRoutes);
app.use('/company/api', companyRoutes);
app.use('/job/api', jobRoutes);
app.use('/application/api', applicationRoutes);

app.get('/', (req, res) => {
    res.send("Hello World!");
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`server runnning on http://localhost:${PORT}`);
})
