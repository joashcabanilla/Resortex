export default function Custom404(){
    return <></>
}
export async function getStaticProps() {
    return {
        redirect:{
            destination:'/',
            permanent:false,
        }
    }
  }