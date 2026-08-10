import useLoginStore from "@/store/useLoginStore.js"

export default {
    install(app){
        app.directive('permission',{
            mounted(el,binding) {
                const LoginStore = useLoginStore()
                const auth = LoginStore.user.ruleNames.includes(binding.value)
                if(auth == false){
                    el && el.parentNode.removeChild(el)
                }
            },
        })
    }
}