import loader from "../../assets/svgs/loader.svg"

const Loader = () => {
  return (
    <div className='w-full flex items-center justify-center'>
        <img src={loader} alt="" className='animate-spin w-10 h-10'/>
    </div>
  )
}

export default Loader