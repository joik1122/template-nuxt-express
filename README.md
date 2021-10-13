# template-nuxt-express
> Creator: 한승진  
> Date: 2021/10/13


## Description
* 빠르게 Frontend Nuxt - Express 스택을 구성할 수 있는 템플릿입니다. 


## 해당 템플릿을 이용하여 개발할 때

__QuickStart : 폴더 검색으로 @EditPoint를 검색하여 나온 부분들을 모두 확인하며 수정하시면 됩니다.__

1. /k8s 하위의 `Chart.yaml`, `values.yaml` 파일을 수정해주세요.
2. `prod.values.yaml`의 `external.domain`을 수정해주세요.
3. `prod.values.yaml`의 `useOnly`를 알맞게 수정해주세요.
4. `skaffold.yaml`에 예시로 되어있는 벨류들을 변경해주세요.
5. 필요에 따라 `Dockerfile` 수정이 필요할 수 있으니 `Dockerfile`의 내용도 확인해주세요.
6. `Dockerfile`은 젠킨스에서 빌드할 때 사용하는 파일입니다. 로컬에서는 `DockerfileSkaffold`를 이용하니 해당내용도 확인해주세요.
7. 기본적인 환경 설정 및 NUXT 설정들이 되어있으나, 필요 없거나 필요한 것들은 커스텀하여 개발하시면 됩니다.
8. 실제 배포전, `/k8s/templates/deployment.yaml`의 리소스 설정이 상당히 중요합니다. 꼭 팀원과 상의하세요!


----------------------------------
### ↓ xhr은 nuxt 모듈로 제공하는 axios를 사용할 것
```
// 잘못된 예
import axios from 'axios';

export default {
  beforeCreate: function(){
    try {
      axios.get('/api/was/auth')
      .then(response => { console.log(response.data); })
      .catch(error => { console.log(error); });
    } catch(error) {
      console.log(error);
    }
  }
}

////////////////////////////////////////////

/**
 * 올바른 사용
 * 이렇게 사용하지 않으면, axios 모듈 baseurl 설정이 적용되지 않아, 다양한 문제가 발생합니다.
 */
export default {
  beforeCreate: function(){
    try {
      this.$axios.get('/api/was/auth')
      .then(response => { console.log(response.data); })
      .catch(error => { console.log(error); });
    } catch(error) {
      console.log(error);
    }
  },
  async asyncData ({ $axios }) {
    const test = await $axios.$get('/api/test')
    return {
      test
    }
  }
}

```

### ↓ static 폴더 안의 정적 리소스는 `/static/` 경로를 기준으로 작성합니다.  [[HTML base tag]](https://www.w3schools.com/tags/tag_base.asp)
```
/**
 * 실제 리소스 경로 : /src/app/static/hello.png
 * 작업 파일 경로 : /src/pages/test.vue
 */
<img src="hello.png" />    // O
<img src="/hello.png" />   // X
<img src="./hello.png" />  // X


/**********************************************/

/**
 * 실제 리소스 경로 : /src/app/static/images/hello.png
 * 작업 파일 경로 : /src/pages/members/jonas/intro.vue
 */
<img src="images/hello.png" />    // O
<img src="./images/hello.png" />  // X
<img src="/images/hello.png" />   // X
<img src="../../hello.png" />     // X 

```

  
----------------------------------

## 분산추적 가이드


>[[OpenTracing?]](https://www.nurinamu.com/dev/2020/02/26/opentracing/)  
>[[Zipkin을 이용한 MSA 환경에서 분산 트렌젝션의 추적]](https://bcho.tistory.com/1243)  
>[[Jaeger + Istio를 이용한 Tracing 개념 이해]](https://blog.naver.com/alice_k106/221832024817)

편리한 개발을 위해 기본적인 트레이싱 예제와 소스를 해당 템플릿에 포함하고 있습니다. `/src/app/api` 디렉토리의 소스들을 확인해주세요.
 
----------------------------------
## serverMiddleware
`Client ---(request)---> FrontService <---(proxy,request)---> BackendService` 3Tier 구성에서   
`FrontendService <---(proxy,request)---> BackendService` 통신을 위해, express [서버 미들웨어](https://ko.nuxtjs.org/docs/2.x/configuration-glossary/configuration-servermiddleware/)를 포함하고 있습니다.  
nuxt.config.js와 api 하위 디렉토리를 확인해주세요.

