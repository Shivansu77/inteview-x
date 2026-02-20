import mongoose, {connect} from 'mongoose';

const connectDb = async () => {
    try{
        mongoose.connect('');
    }catch(err){
        console.error
    }
}

export default connectDb;