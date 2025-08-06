import { currentUser } from "@clerk/nextjs/server";

export const checkUser = async () => {
    const user = await currentUser();


// clerk pese check karre ki user hai ki nahi agar nhi to null 
if(!user) {
    return null;
}

try {
    const loggedInUser = await db.user.findUnique({
        where: {
            clerUserId: user.id,
        },
    });

    if(loggedInUser) {
        return loggedInUser;
    }
    const name = `${user.firstName} ${user.lastName}`;

    const newUser = await db.user.create({
        data:{
            clerUserId: user.id,
            name,
            imageUrl: user.imageUrl,
            email: user.emailAddresses[0].emailAddress,
        },
    });

    return newUser;
 } catch (error) {
    console.log(error.message);
    
 }
}