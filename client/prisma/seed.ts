import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

const userData: Prisma.UserCreateInput[] = [
  {

    name: 'Mohamad Asadi',
    email: 'wyattmohammad1371017@gmail.com',
    username: 'mohamad_21',
    password: null,
    account_type: 'oAuth',
    profile_photo: 'https://lh3.googleusercontent.com/a/ACg8ocKg_vjkVLG9iuqR78c4k6MfAbtaQAgARFaEJiHc9fhN0bzsufm_=s96-c',
  },
  {
    name: 'ewae',
    email: 'awe@gmail.com',
    username: 'aweawe',
    password: '$2b$10$i9TqBhr3jK6AD23a5Tkt5.fFlFguX.aZFn2lzFPswVcfqLh53uIEW',
    account_type: 'credential',
    profile_photo: null,
  },
  {
    name: 'mohamad',
    email: 'mohamad121.me@gmail.com',
    username: 'mohamad_5',
    password: null,
    account_type: 'oAuth',
    profile_photo: 'https://lh3.googleusercontent.com/a/ACg8ocLP1qfbe49kniED7Jz8kSTLIfMgYr6v-kN6jGkzUtcAhDKpTwo=s96-c',
  },
  {
    name: 'eee',
    email: 'weawe@gmail.com',
    username: 'eeeeewae',
    password: '$2b$10$r9gXofPLw4KA4Xs841O5hur0MiS5vjB6GHY5yrQaI6sE46EJiFW8K',
    account_type: 'credential',
    profile_photo: null,
  }
]

const channelData = [

  {
    name: 'juventus',
    link: 'juventus_fc',
    profile_photo: 'https://media.licdn.com/dms/image/v2/C4D0BAQFm8vuw1HL0bQ/company-logo_200_200/company-logo_200_200/0/1638041249962/juventus_football_club_logo?e=2147483647&v=beta&t=T9x7mN6q2QlYqANqhwvalsj_iS',
    owner_id: 1
  },
  {
    name: 'Golang',
    link: 'golang_dev',
    profile_photo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZizcwmsMODgmX-gyOD0CfqYYUP_8sq_zufAyPyMNxJ-K2FP3XT2nWG6t1QYc25hdAPhE&usqp=CAU',
    owner_id: 1
  }
]

export async function main() {
  for (const u of userData) {
    await prisma.user.create({ data: u });
  }
  for (const c of channelData) {
    await prisma.channel.create({ data: c });
  }
}

main()