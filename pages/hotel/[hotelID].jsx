import { useRouter } from 'next/router'

export default function Hotel() {
    //INITIALIZATION OF VARIABLES----------------------------------------------------------
    const router = useRouter();
    const { hotelID } = router.query;
    return (
        <div>HOTEL {hotelID}</div>
    )
}