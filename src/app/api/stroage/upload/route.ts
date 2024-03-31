import { NextResponse } from 'next/server'
import { S3Client, PutObjectCommand, PutObjectCommandInput } from '@aws-sdk/client-s3'



const s3Client = new S3Client({
    region: String(process.env.NEXT_PUBLIC_AWS_REGION),
    credentials: {
        accessKeyId: String(process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID),
        secretAccessKey: String(process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY)
    }
})



async function uploadFileToS3(
    file: Buffer, fileName: string, ContentType: string
) {

    const fileBuffer = file


    const params: PutObjectCommandInput = {
        Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
        Key: fileName,
        Body: fileBuffer,
        ContentType
    }

    const command = new PutObjectCommand(params)

    const data = await s3Client.send(command)


    const this_url = `https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${fileName}`




    return this_url
}

export async function POST(request: Request) {

    try {

        const fromData = await request.formData()
        const file = fromData.get("file") as File




        if (!file) {
            return NextResponse.json({
                error: "File is required"
            }, { status: 400 })
        }

        const buffer = Buffer.from(await file.arrayBuffer())

        const url = await uploadFileToS3(buffer, file.name, file.type)


        console.log(url)
        return NextResponse.json({
            success: true,
            url
        })




        // const filename = await uploadFileToS3(buffer, file.name)


        // return NextResponse.json({
        //     success: true,
        //     fileName: filename,
        // })

    } catch (error: any) {

        return NextResponse.json(
            {
                e: error
            }, {
            status: 400
        }
        )
    }

}