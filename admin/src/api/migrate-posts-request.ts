import {request} from "@strapi/helper-plugin"

const migrationRequest ={
    migratePost: async () =>{
       return await request("/w-to-s-migrator/migrate-post/1/8/100",{
            method:'POST',
            body:{ username:"bedada",
                password:"M483Ia$pP$zDKDU7C1(Kja2G"}
        })
    },
    migrateAuthor: async () =>{
       return await request("/w-to-s-migrator/migrate-author",{
            method:'POST',
            body:{ username:"bedada",
                password:"M483Ia$pP$zDKDU7C1(Kja2G"}
        })
    },
    migrateUser: async () =>{
       return await request("/w-to-s-migrator/migrate-users/1/72/100",{
            method:'POST',
            body:{ username:"bedada",
                password:"M483Ia$pP$zDKDU7C1(Kja2G"}
        })
    },
    migrateCategory: async () =>{
       return await request("/w-to-s-migrator/migrate-category/1/8/10",{
            method:'POST',
            body:{ username:"bedada",
                password:"M483Ia$pP$zDKDU7C1(Kja2G"}
        })
    },
    migrateComment: async () =>{
       return await request("/w-to-s-migrator/migrate-comment/1/9/10",{
            method:'POST',
            body:{ username:"bedada",
                password:"M483Ia$pP$zDKDU7C1(Kja2G"}
        })
    },
    migrateMedia: async () =>{
       return await request("/w-to-s-migrator/migrate-media/1/19/100",{
            method:'POST',
            body:{ username:"bedada",
                password:"M483Ia$pP$zDKDU7C1(Kja2G"}
        })
    },
    migrateTag: async () =>{
       return await request("/w-to-s-migrator/migrate-tag/1/27/10",{
            method:'POST',
            body:{ username:"bedada",
                password:"M483Ia$pP$zDKDU7C1(Kja2G"}
        })
    }
}

export default migrationRequest