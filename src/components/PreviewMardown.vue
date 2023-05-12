<template>
  <v-md-preview :text="str"></v-md-preview>
  <div class="preview-close" @click="closePreview">
    <span>关闭</span>
  </div>
</template>

<script >

export default {
  name: "PreviewMardown",
  methods: {
    closePreview() {
      this.$emit('close'); // 发送关闭预览事件
    }
  },
  props: {
    content: {
      content: String,
      type: String,
    }, // 定义一个名为previewUrl的prop，类型为String
  },
  data() {
    return {
      str: '<p style="text-align:center;font-size:30px">springboot聚合接口数据</p>\n' +
        '\n' +
        '### 1.背景\n' +
        '\n' +
        '最近在写`Android` 大作业,做一个教育类的`APP`,后端是用的`springboot`来开发的，由`springboot`返回`json`数据接口,`Android`使用`OKHttpUtils`来请求后端的数据接口,在开发首页的时候,一共有四组不同的数据,也就意味着我要请求四个不同的接口来获取数据。这显然是有点多余,并且有很多重复的代码，这时候我就在想,后端能不能把这四组数据一起返回给我呢?果不其然,找到了`spring-boot-data-aggregator-starter`可以实现我的需求。\n' +
        '\n' +
        '### 2.实现\n' +
        '\n' +
        '`spring-boot-data-aggregator-starter`已经发布到了`maven`中央仓库,所以只需要在`pom.xml`文件引入该依赖即可。\n' +
        '\n' +
        '```xml\n' +
        '<dependency>\n' +
        '    <groupId>io.github.lvyahui8</groupId>\n' +
        '    <artifactId>spring-boot-data-aggregator-starter</artifactId>\n' +
        '    <version>1.1.3</version>\n' +
        '</dependency>\n' +
        '```\n' +
        '\n' +
        '在` application.properties`文件中声明注解的扫描路径\n' +
        '\n' +
        '```properties\n' +
        'io.github.lvyahui8.spring.base-packages=com.example.shoppingmall_end\n' +
        '```\n' +
        '\n' +
        '上述的包名只需要换成你项目的包名即可\n' +
        '\n' +
        '我所用到的三个类分别是\n' +
        '\n' +
        '- `Video`\n' +
        '\n' +
        '- `VideoBanner`\n' +
        '\n' +
        '- `Channel`\n' +
        '\n' +
        '  然后定了一`ResultBeana`类,属性分别是上面三个类的List集合\n' +
        '\n' +
        '  \n' +
        '\n' +
        '```java\n' +
        'public class ResultBean {\n' +
        '\n' +
        '    private List<Video> video;\n' +
        '\n' +
        '    private List<VideoBanner> videoBanner;\n' +
        '\n' +
        '    public List<Channel> getListChannel() {\n' +
        '        return listChannel;\n' +
        '    }\n' +
        '\n' +
        '    public void setListChannel(List<Channel> listChannel) {\n' +
        '        this.listChannel = listChannel;\n' +
        '    }\n' +
        '\n' +
        '    private List<Channel> channelList;\n' +
        '\n' +
        '    private List<VideoBanner> actList;\n' +
        '\n' +
        '    private List<Channel> listChannel;\n' +
        '\n' +
        '    public List<Video> getVideo() {\n' +
        '        return video;\n' +
        '    }\n' +
        '\n' +
        '    public void setVideo(List<Video> video) {\n' +
        '        this.video = video;\n' +
        '    }\n' +
        '\n' +
        '    public List<VideoBanner> getVideoBanner() {\n' +
        '        return videoBanner;\n' +
        '    }\n' +
        '\n' +
        '    public void setVideoBanner(List<VideoBanner> videoBanner) {\n' +
        '        this.videoBanner = videoBanner;\n' +
        '    }\n' +
        '\n' +
        '    public List<Channel> getChannelList() {\n' +
        '        return channelList;\n' +
        '    }\n' +
        '\n' +
        '    public void setChannelList(List<Channel> channelList) {\n' +
        '        this.channelList = channelList;\n' +
        '    }\n' +
        '\n' +
        '    public List<VideoBanner> getActList() {\n' +
        '        return actList;\n' +
        '    }\n' +
        '\n' +
        '    public void setActList(List<VideoBanner> actList) {\n' +
        '        this.actList = actList;\n' +
        '    }\n' +
        '}\n' +
        '```\n' +
        '\n' +
        '接着我们需要在`ServiceImpl`需要聚合的方法上加上注解`@DataProvider(id = "name")`,比如:\n' +
        '\n' +
        '在`VideoServiceImpl` 里的方法中\n' +
        '\n' +
        '```java\n' +
        '@DataProvider(id = "videoList")\n' +
        '    @Override\n' +
        '    public List<Video> listVideo() {\n' +
        '\n' +
        '        try {\n' +
        '\n' +
        '            Object cacheVideoList = baseCache.getTenMinutesCache().get(CacheKeyManager.INDEX_VIDEO_LIST, () -> {\n' +
        '\n' +
        '                List<Video> videoList = videoMapper.listVideo();\n' +
        '                System.out.println("从数据库拿视频列表数据");\n' +
        '                return videoList;\n' +
        '            });\n' +
        '\n' +
        '            if (cacheVideoList instanceof List) {\n' +
        '                List<Video> videoList = (List<Video>) cacheVideoList;\n' +
        '                return videoList;\n' +
        '            }\n' +
        '\n' +
        '        } catch (Exception e) {\n' +
        '            e.printStackTrace();\n' +
        '        }\n' +
        '\n' +
        '        return null;\n' +
        '    }\n' +
        '\n' +
        '@DataProvider(id = "banner")\n' +
        '    @Override\n' +
        '    public List<VideoBanner> listBanner() {\n' +
        '\n' +
        '        try {\n' +
        '\n' +
        '            Object cacheBanner = baseCache.getTenMinutesCache().get(CacheKeyManager.INDEX_BANNER_KEY, () -> {\n' +
        '                List<VideoBanner> bannerList = videoMapper.listBanner();\n' +
        '                System.out.println("从数据库里拿轮播图数据");\n' +
        '                return bannerList;\n' +
        '            });\n' +
        '\n' +
        '            if (cacheBanner instanceof List) {\n' +
        '                List<VideoBanner> bannerList = (List<VideoBanner>) cacheBanner;\n' +
        '                return bannerList;\n' +
        '            }\n' +
        '\n' +
        '        } catch (Exception e) {\n' +
        '            e.printStackTrace();\n' +
        '        }\n' +
        '\n' +
        '        return null;\n' +
        '    }\n' +
        '\n' +
        '@DataProvider(id = "actList")\n' +
        '    @Override\n' +
        '    public List<VideoBanner> getActList() {\n' +
        '        return videoMapper.getActList();\n' +
        '    }\n' +
        '```\n' +
        '\n' +
        '以及在`ChannelServiceImpl`的中方法中\n' +
        '\n' +
        '```java\n' +
        ' @DataProvider(id = "channelList")\n' +
        '    @Override\n' +
        '    public List<Channel> getChannelList() {\n' +
        '        return channelMapper.getChannelList();\n' +
        '    }\n' +
        '\n' +
        '    @DataProvider(id = "listChannel")\n' +
        '    @Override\n' +
        '    public List<Channel> listChannel() {\n' +
        '        return channelMapper.listChannel();\n' +
        '    }\n' +
        '```\n' +
        '\n' +
        '```\n' +
        '@DataProvider(id = "name")表示是数据提供者\n' +
        '```\n' +
        '\n' +
        '接着我们需要定义一个`HomeAggregate`类,类名随便取\t\n' +
        '\n' +
        '```java\n' +
        '@Component\n' +
        'public class HomeAggregate {\n' +
        '    @DataProvider(id = "HomeData")\n' +
        '    public ResultBean homeData(@DataConsumer(id = "banner") List<VideoBanner> videoBanner,\n' +
        '                               @DataConsumer(id = "videoList") List<Video> videoList,\n' +
        '                               @DataConsumer(id = "channelList") List<Channel> channelList,\n' +
        '                               @DataConsumer(id = "actList") List<VideoBanner> actList,\n' +
        '                               @DataConsumer(id = "listChannel") List<Channel> listChannel) {\n' +
        '\n' +
        '        ResultBean resultBean = new ResultBean();\n' +
        '        resultBean.setChannelList(channelList);\n' +
        '        resultBean.setActList(actList);\n' +
        '        resultBean.setVideoBanner(videoBanner);\n' +
        '        resultBean.setVideo(videoList);\n' +
        '        resultBean.setListChannel(listChannel);\n' +
        '        return resultBean;\n' +
        '\n' +
        '    }\n' +
        '}\n' +
        '```\n' +
        '\n' +
        '最后,我们定义一个`HomeController`类，\n' +
        '\n' +
        '```java\n' +
        '@RestController\n' +
        '@RequestMapping("api/v1/pub/home")\n' +
        'public class HomeController {\n' +
        '\n' +
        '    @Autowired\n' +
        '    private DataBeanAggregateQueryFacade dataBeanAggregateQueryFacade;\n' +
        '\n' +
        '    /**\n' +
        '     * 获取首页数据\n' +
        '     * @return 首页数据\n' +
        '     * @throws InterruptedException 异常\n' +
        '     * @throws InvocationTargetException 异常\n' +
        '     * @throws IllegalAccessException 异常\n' +
        '     */\n' +
        '    @RequestMapping("/getData")\n' +
        '    public ResultBean test() throws InterruptedException, InvocationTargetException, IllegalAccessException {\n' +
        '\n' +
        '        return dataBeanAggregateQueryFacade.get("HomeData",Collections.singletonMap("",""),ResultBean.class);\n' +
        '    }\n' +
        '}\n' +
        '```\n' +
        '\n' +
        '> 因为这些数据是直接请求的,不需要传参,所以在`Collections.singletonMap("","")`里没有传参,如果有参数话的填写对应参数,比如：需要video_id 才能请求到这些数据话,那么只需要改成`Collections.singletonMap("video_id",videoId)即可`\n' +
        '\n' +
        '这时候我们启动项目\n' +
        '\n' +
        '![](/Users/maoyu/Downloads/1.png)\n' +
        '\n' +
        '发现如上图所示代表数据聚合成功\n' +
        '\n' +
        '>如果在其他方法上也添加了`@DataProvider(id = "name")`的话，而你没有在使用它,那么启动项目的时候会报错，所以不需要数据聚合的方法上不需要添加该注解\n'
    }
  },
};
</script>

<style scoped>

</style>