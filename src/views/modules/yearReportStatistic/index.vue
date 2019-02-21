<template>
  <section style="padding: 10px 30px;">
    <div class="toolbar">
      <el-date-picker
        v-model="year"
        type="year"
        placeholder="选择统计年度"
        value-format="yyyy"
        :clearable="false"
        @change="handleChange"
        style="width: 180px">
      </el-date-picker>
      <el-button type="primary" @click="handleStatistic" :loading="loading">统计</el-button>
      <el-button type="primary" @click="save">保存</el-button>
    </div>
    <div>
      <table class="statistic-table">
        <tr>
          <th colspan="4">类&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别</th>
          <th width="100">计量单位</th>
          <th width="100">数量</th>
        </tr>
        <tr>
          <td colspan="4">机构数</td>
          <td>个</td>
          <td><input type="number" v-model="dataFrom.zd1"></td>
        </tr>
        <tr>
          <td rowspan="23" width="60">专职人员</td>
          <td colspan="3">总数</td>
          <td>人</td>
          <td><input type="number" v-model="dataFrom.zd2"></td>
        </tr>
        <tr>
          <td colspan="3">女性</td>
          <td>人</td>
          <td><input type="number" v-model="dataFrom.zd3"></td>
        </tr>
        <tr>
          <td rowspan="3" width="60">年龄</td>
          <td colspan="2">50岁及以上</td>
          <td>人</td>
          <td><input type="number" v-model="dataFrom.zd4"></td>
        </tr>
        <tr>
          <td colspan="2">35-49岁</td>
          <td>人</td>
          <td><input type="number" v-model="dataFrom.zd5"></td>
        </tr>
        <tr>
          <td colspan="2">34岁及以下</td>
          <td>人</td>
          <td><input type="number" v-model="dataFrom.zd6"></td>
        </tr>
        <tr>
          <td rowspan="7">文化程度</td>
          <td colspan="2">博士研究生</td>
          <td>人</td>
          <td><input type="number" v-model="dataFrom.zd7"></td>
        </tr>
        <tr>
          <td colspan="2">硕士研究生</td>
          <td>人</td>
          <td><input type="number" v-model="dataFrom.zd8"></td>
        </tr>
        <tr>
          <td colspan="2">研究生班研究生</td>
          <td>人</td>
          <td><input type="number" v-model="dataFrom.zd9"></td>
        </tr>
        <tr>
          <td colspan="2">双学士</td>
          <td>人</td>
          <td><input type="number" v-model="dataFrom.zd10"></td>
        </tr>
        <tr>
          <td colspan="2">大学本科</td>
          <td>人</td>
          <td><input type="number" v-model="dataFrom.zd11"></td>
        </tr>
        <tr>
          <td colspan="2">大专</td>
          <td>人</td>
          <td><input type="number" v-model="dataFrom.zd12"></td>
        </tr>
        <tr>
          <td colspan="2">高中（中专）及以下</td>
          <td>人</td>
          <td><input type="number" v-model="dataFrom.zd13"></td>
        </tr>

        <tr>
          <td rowspan="6">专业文化程度</td>
          <td colspan="2">博士研究生</td>
          <td>人</td>
          <td><input type="number" v-model="dataFrom.zd14"></td>
        </tr>
        <tr>
          <td colspan="2">硕士研究生</td>
          <td>人</td>
          <td><input type="number" v-model="dataFrom.zd15"></td>
        </tr>
        <tr>
          <td colspan="2">研究生班研究生</td>
          <td>人</td>
          <td><input type="number" v-model="dataFrom.zd16"></td>
        </tr>
        <tr>
          <td colspan="2">大学本科</td>
          <td>人</td>
          <td><input type="number" v-model="dataFrom.zd17"></td>
        </tr>
        <tr>
          <td colspan="2">大专</td>
          <td>人</td>
          <td><input type="number" v-model="dataFrom.zd18"></td>
        </tr>
        <tr>
          <td colspan="2">中专</td>
          <td>人</td>
          <td><input type="number" v-model="dataFrom.zd19"></td>
        </tr>

        <tr>
          <td rowspan="5">档案干部专业技术职务</td>
          <td colspan="2">研究馆员</td>
          <td>人</td>
          <td><input type="number" v-model="dataFrom.zd20"></td>
        </tr>
        <tr>
          <td colspan="2">副研究馆员</td>
          <td>人</td>
          <td><input type="number" v-model="dataFrom.zd21"></td>
        </tr>
        <tr>
          <td colspan="2">馆员</td>
          <td>人</td>
          <td><input type="number" v-model="dataFrom.zd22"></td>
        </tr>
        <tr>
          <td colspan="2">助理馆员</td>
          <td>人</td>
          <td><input type="number" v-model="dataFrom.zd23"></td>
        </tr>
        <tr>
          <td colspan="2">管理员</td>
          <td>人</td>
          <td><input type="number" v-model="dataFrom.zd24"></td>
        </tr>

        <tr>
          <td colspan="4">兼职人员</td>
          <td>人</td>
          <td><input type="number" v-model="dataFrom.zd25"></td>
        </tr>

        <tr>
          <td colspan="4" rowspan="2">本年度接受档案业务在职培训教育</td>
          <td>人</td>
          <td><input type="number" v-model="dataFrom.zd26"></td>
        </tr>
        <tr>
          <td>次</td>
          <td><input type="number" v-model="dataFrom.zd27"></td>
        </tr>

        <tr>
          <td rowspan="38" width="60">室存情况</td>
          <td rowspan="8">纸质档案</td>
          <td colspan="2">案卷</td>
          <td>卷</td>
          <td><input type="number" v-model="dataFrom.zd28"></td>
        </tr>
        <tr>
          <td colspan="2">以件为保管单位档案</td>
          <td>件</td>
          <td><input type="number" v-model="dataFrom.zd29"></td>
        </tr>
        <tr>
          <td colspan="2">总排架长度</td>
          <td>件</td>
          <td><input type="number" v-model="dataFrom.zd30"></td>
        </tr>
        <tr>
          <td colspan="2">底图</td>
          <td>件</td>
          <td><input type="number" v-model="dataFrom.zd31"></td>
        </tr>
        <tr>
          <td rowspan="4" width="150">室存永久、30年（长期）档案</td>
          <td rowspan="2" width="150">总共</td>
          <td>卷</td>
          <td><input type="number" v-model="dataFrom.zd32"></td>
        </tr>
        <tr>
          <td>件</td>
          <td><input type="number" v-model="dataFrom.zd33"></td>
        </tr>
        <tr>
          <td rowspan="2">永久保存</td>
          <td>卷</td>
          <td><input type="number" v-model="dataFrom.zd34"></td>
        </tr>
        <tr>
          <td>件</td>
          <td><input type="number" v-model="dataFrom.zd35"></td>
        </tr>

        <tr>
          <td rowspan="3">电子档案</td>
          <td colspan="2">总大小</td>
          <td>GB</td>
          <td><input type="number" v-model="dataFrom.zd36"></td>
        </tr>
        <tr>
          <td colspan="2">数码照片</td>
          <td>GB</td>
          <td><input type="number" v-model="dataFrom.zd37"></td>
        </tr>
        <tr>
          <td colspan="2">数字录音、数字录像</td>
          <td>GB</td>
          <td><input type="number" v-model="dataFrom.zd38"></td>
        </tr>

        <tr>
          <td rowspan="3">其他载体档案</td>
          <td colspan="2">照片档案</td>
          <td>张</td>
          <td><input type="number" v-model="dataFrom.zd39"></td>
        </tr>
        <tr>
          <td colspan="2">录音磁带、录像磁带、影片档案</td>
          <td>盘</td>
          <td><input type="number" v-model="dataFrom.zd40"></td>
        </tr>
        <tr>
          <td colspan="2">缩微胶片</td>
          <td>万幅</td>
          <td><input type="number" v-model="dataFrom.zd41"></td>
        </tr>

        <tr>
          <td colspan="3">实物档案</td>
          <td>件</td>
          <td><input type="number" v-model="dataFrom.zd42"></td>
        </tr>

        <tr>
          <td rowspan="7">档案数字化成果</td>
          <td rowspan="4">纸质档案</td>
          <td rowspan="2">案卷</td>
          <td>卷</td>
          <td><input type="number" v-model="dataFrom.zd43"></td>
        </tr>
        <tr>
          <td>GB</td>
          <td><input type="number" v-model="dataFrom.zd44"></td>
        </tr>
        <tr>
          <td rowspan="2">以件为保管单位档案</td>
          <td>件</td>
          <td><input type="number" v-model="dataFrom.zd45"></td>
        </tr>
        <tr>
          <td>GB</td>
          <td><input type="number" v-model="dataFrom.zd46"></td>
        </tr>

        <tr>
          <td rowspan="3">其他载体档案</td>
          <td>照片档案</td>
          <td>GB</td>
          <td><input type="number" v-model="dataFrom.zd47"></td>
        </tr>
        <tr>
          <td>录音磁带、录像磁带、影片档案</td>
          <td>GB</td>
          <td><input type="number" v-model="dataFrom.zd48"></td>
        </tr>
        <tr>
          <td>其他</td>
          <td>GB</td>
          <td><input type="number" v-model="dataFrom.zd49"></td>
        </tr>

        <tr>
          <td rowspan="4">室存档案历史分期</td>
          <td colspan="2" rowspan="2">新中国成立前档案</td>
          <td>卷</td>
          <td><input type="number" v-model="dataFrom.zd50"></td>
        </tr>
        <tr>
          <td>件</td>
          <td><input type="number" v-model="dataFrom.zd51"></td>
        </tr>
        <tr>
          <td colspan="2" rowspan="2">新中国成立后档案</td>
          <td>卷</td>
          <td><input type="number" v-model="dataFrom.zd52"></td>
        </tr>
        <tr>
          <td>件</td>
          <td><input type="number" v-model="dataFrom.zd53"></td>
        </tr>

        <tr>
          <td rowspan="3">档案编目情况</td>
          <td colspan="2">手工目录</td>
          <td>本</td>
          <td><input type="number" v-model="dataFrom.zd54"></td>
        </tr>
        <tr>
          <td rowspan="2">机读目录</td>
          <td>案卷级</td>
          <td>万条</td>
          <td><input type="number" v-model="dataFrom.zd55"></td>
        </tr>
        <tr>
          <td>文件级</td>
          <td>万条</td>
          <td><input type="number" v-model="dataFrom.zd56"></td>
        </tr>

        <tr>
          <td rowspan="9">本年度接收档案情况</td>
          <td rowspan="3">纸质档案</td>
          <td>案卷</td>
          <td>卷</td>
          <td><input type="number" v-model="dataFrom.zd57"></td>
        </tr>
        <tr>
          <td>以件为保管单位档案</td>
          <td>件</td>
          <td><input type="number" v-model="dataFrom.zd58"></td>
        </tr>
        <tr>
          <td>底图</td>
          <td>张</td>
          <td><input type="number" v-model="dataFrom.zd59"></td>
        </tr>
        <tr>
          <td rowspan="3">电子档案</td>
          <td>总</td>
          <td>GB</td>
          <td><input type="number" v-model="dataFrom.zd60"></td>
        </tr>
        <tr>
          <td>数码照片</td>
          <td>GB</td>
          <td><input type="number" v-model="dataFrom.zd61"></td>
        </tr>
        <tr>
          <td>数字录音、数字录像</td>
          <td>GB</td>
          <td><input type="number" v-model="dataFrom.zd62"></td>
        </tr>

        <tr>
          <td rowspan="2">其他载体档案</td>
          <td>照片档案</td>
          <td>张</td>
          <td><input type="number" v-model="dataFrom.zd63"></td>
        </tr>
        <tr>
          <td>录音磁带、录像磁带、影片档案</td>
          <td>盘</td>
          <td><input type="number" v-model="dataFrom.zd64"></td>
        </tr>

        <tr>
          <td colspan="2">实物档案</td>
          <td>件</td>
          <td><input type="number" v-model="dataFrom.zd65"></td>
        </tr>

        <tr>
          <td rowspan="14">本年度向档案馆移交档案</td>
          <td rowspan="2">纸质档案</td>
          <td colspan="2">案卷</td>
          <td>卷</td>
          <td><input type="number" v-model="dataFrom.zd66"></td>
        </tr>
        <tr>
          <td colspan="2">以件为保管单位档案</td>
          <td>件</td>
          <td><input type="number" v-model="dataFrom.zd67"></td>
        </tr>

        <tr>
          <td rowspan="3">电子档案</td>
          <td colspan="2">总</td>
          <td>GB</td>
          <td><input type="number" v-model="dataFrom.zd68"></td>
        </tr>
        <tr>
          <td colspan="2">数码照片</td>
          <td>GB</td>
          <td><input type="number" v-model="dataFrom.zd69"></td>
        </tr>
        <tr>
          <td colspan="2">数字录音、数字录像</td>
          <td>GB</td>
          <td><input type="number" v-model="dataFrom.zd70"></td>
        </tr>

        <tr>
          <td rowspan="2">其他载体档案</td>
          <td colspan="2">照片档案</td>
          <td>张</td>
          <td><input type="number" v-model="dataFrom.zd71"></td>
        </tr>
        <tr>
          <td colspan="2">录音磁带、录像磁带、影片档案</td>
          <td>盘</td>
          <td><input type="number" v-model="dataFrom.zd72"></td>
        </tr>

        <tr>
          <td rowspan="7">室存档案数字化成果</td>
          <td rowspan="4">纸质档案</td>
          <td rowspan="2">案卷</td>
          <td>卷</td>
          <td><input type="number" v-model="dataFrom.zd73"></td>
        </tr>
        <tr>
          <td>GB</td>
          <td><input type="number" v-model="dataFrom.zd74"></td>
        </tr>
        <tr>
          <td rowspan="2">以件为保管单位档案</td>
          <td>件</td>
          <td><input type="number" v-model="dataFrom.zd75"></td>
        </tr>
        <tr>
          <td>GB</td>
          <td><input type="number" v-model="dataFrom.zd76"></td>
        </tr>

        <tr>
          <td rowspan="3">其他载体档案</td>
          <td>照片档案</td>
          <td>GB</td>
          <td><input type="number" v-model="dataFrom.zd77"></td>
        </tr>
        <tr>
          <td>录音磁带、录像磁带、影片档案</td>
          <td>GB</td>
          <td><input type="number" v-model="dataFrom.zd78"></td>
        </tr>
        <tr>
          <td>其他</td>
          <td>GB</td>
          <td><input type="number" v-model="dataFrom.zd79"></td>
        </tr>

        <tr>
          <td rowspan="14">本年度移出档案</td>
          <td rowspan="2">纸质档案</td>
          <td colspan="2">案卷</td>
          <td>卷</td>
          <td><input type="number" v-model="dataFrom.zd80"></td>
        </tr>
        <tr>
          <td colspan="2">以件为保管单位档案</td>
          <td>件</td>
          <td><input type="number" v-model="dataFrom.zd81"></td>
        </tr>

        <tr>
          <td rowspan="3">电子档案</td>
          <td colspan="2">总</td>
          <td>GB</td>
          <td><input type="number" v-model="dataFrom.zd82"></td>
        </tr>
        <tr>
          <td colspan="2">数码照片</td>
          <td>GB</td>
          <td><input type="number" v-model="dataFrom.zd83"></td>
        </tr>
        <tr>
          <td colspan="2">数字录音、数字录像</td>
          <td>GB</td>
          <td><input type="number" v-model="dataFrom.zd84"></td>
        </tr>

        <tr>
          <td rowspan="2">其他载体档案</td>
          <td colspan="2">照片档案</td>
          <td>张</td>
          <td><input type="number" v-model="dataFrom.zd85"></td>
        </tr>
        <tr>
          <td colspan="2">录音磁带、录像磁带、影片档案</td>
          <td>盘</td>
          <td><input type="number" v-model="dataFrom.zd86"></td>
        </tr>

        <tr>
          <td rowspan="7">档案数字化成果</td>
          <td rowspan="4">纸质档案</td>
          <td rowspan="2">案卷</td>
          <td>卷</td>
          <td><input type="number" v-model="dataFrom.zd87"></td>
        </tr>
        <tr>
          <td>GB</td>
          <td><input type="number" v-model="dataFrom.zd88"></td>
        </tr>
        <tr>
          <td rowspan="2">以件为保管单位档案</td>
          <td>件</td>
          <td><input type="number" v-model="dataFrom.zd89"></td>
        </tr>
        <tr>
          <td>GB</td>
          <td><input type="number" v-model="dataFrom.zd90"></td>
        </tr>

        <tr>
          <td rowspan="3">其他载体档案</td>
          <td>照片档案</td>
          <td>GB</td>
          <td><input type="number" v-model="dataFrom.zd91"></td>
        </tr>
        <tr>
          <td>录音磁带、录像磁带、影片档案</td>
          <td>GB</td>
          <td><input type="number" v-model="dataFrom.zd92"></td>
        </tr>
        <tr>
          <td>其他</td>
          <td>GB</td>
          <td><input type="number" v-model="dataFrom.zd93"></td>
        </tr>

        <tr>
          <td rowspan="4">本年销毁档案</td>
          <td rowspan="2">纸质档案</td>
          <td colspan="2">案卷</td>
          <td>卷</td>
          <td><input type="number" v-model="dataFrom.zd94"></td>
        </tr>
        <tr>
          <td colspan="2">以件为保管单位档案</td>
          <td>件</td>
          <td><input type="number" v-model="dataFrom.zd95"></td>
        </tr>

        <tr>
          <td rowspan="2">其他载体档案</td>
          <td colspan="2">照片档案</td>
          <td>张</td>
          <td><input type="number" v-model="dataFrom.zd96"></td>
        </tr>
        <tr>
          <td colspan="2">录音磁带、录像磁带、影片档案</td>
          <td>盘</td>
          <td><input type="number" v-model="dataFrom.zd97"></td>
        </tr>

        <tr>
          <td rowspan="13">档案利用情况</td>
          <td rowspan="6">本年利用档案</td>
          <td colspan="2" rowspan="2">总</td>
          <td>人次</td>
          <td><input type="number" v-model="dataFrom.zd98"></td>
        </tr>
        <tr>
          <td>卷（件）次</td>
          <td><input type="number" v-model="dataFrom.zd99"></td>
        </tr>
        <tr>
          <td colspan="2" rowspan="2">工作查证</td>
          <td>人次</td>
          <td><input type="number" v-model="dataFrom.zd100"></td>
        </tr>
        <tr>
          <td>卷（件）次</td>
          <td><input type="number" v-model="dataFrom.zd101"></td>
        </tr>
        <tr>
          <td colspan="2" rowspan="2">其他</td>
          <td>人次</td>
          <td><input type="number" v-model="dataFrom.zd102"></td>
        </tr>
        <tr>
          <td>卷（件）次</td>
          <td><input type="number" v-model="dataFrom.zd103"></td>
        </tr>

        <tr>
          <td rowspan="2" colspan="3">本年利用资源</td>
          <td>人次</td>
          <td><input type="number" v-model="dataFrom.zd104"></td>
        </tr>
        <tr>
          <td>册次</td>
          <td><input type="number" v-model="dataFrom.zd105"></td>
        </tr>

        <tr>
          <td colspan="3">陈列室</td>
          <td>平方米</td>
          <td><input type="number" v-model="dataFrom.zd106"></td>
        </tr>

        <tr>
          <td rowspan="4">本年编研档案资料</td>
          <td rowspan="2" colspan="2">公开出版</td>
          <td>种</td>
          <td><input type="number" v-model="dataFrom.zd107"></td>
        </tr>
        <tr>
          <td>万字</td>
          <td><input type="number" v-model="dataFrom.zd108"></td>
        </tr>
        <tr>
          <td rowspan="2" colspan="2">内部参考</td>
          <td>种</td>
          <td><input type="number" v-model="dataFrom.zd109"></td>
        </tr>
        <tr>
          <td>万字</td>
          <td><input type="number" v-model="dataFrom.zd110"></td>
        </tr>

        <tr>
          <td rowspan="5">室内设施设备情况</td>
          <td rowspan="2">档案室建筑面积</td>
          <td colspan="2">总</td>
          <td>平方米</td>
          <td><input type="number" v-model="dataFrom.zd111"></td>
        </tr>
        <tr>
          <td colspan="2">档案库房建筑面积</td>
          <td>平方米</td>
          <td><input type="number" v-model="dataFrom.zd112"></td>
        </tr>

        <tr>
          <td rowspan="3">档案室设备</td>
          <td colspan="2">服务器</td>
          <td>台</td>
          <td><input type="number" v-model="dataFrom.zd113"></td>
        </tr>
        <tr>
          <td rowspan="2">安全防范系统</td>
          <td>火灾自动报警系统</td>
          <td>套</td>
          <td><input type="number" v-model="dataFrom.zd114"></td>
        </tr>
        <tr>
          <td>温湿度控制系统</td>
          <td>套</td>
          <td><input type="number" v-model="dataFrom.zd115"></td>
        </tr>

        <tr>
          <td colspan="4">数字档案室</td>
          <td>个</td>
          <td><input type="number" v-model="dataFrom.zd116"></td>
        </tr>
      </table>
    </div>
  </section>
</template>
<script>
import {count, add} from '@/api/yearReportAction'
export default {
  name: 'YearReportStatistic', // 年报统计
  data () {
    return {
      year: '',
      dataFrom: {
        zd1: '',
        zd2: '',
        zd3: '',
        zd4: '',
        zd5: '',
        zd6: '',
        zd7: '',
        zd8: '',
        zd9: '',
        zd10: '',
        zd11: '',
        zd12: '',
        zd13: '',
        zd14: '',
        zd15: '',
        zd16: '',
        zd17: '',
        zd18: '',
        zd19: '',
        zd20: '',
        zd21: '',
        zd22: '',
        zd23: '',
        zd24: '',
        zd25: '',
        zd26: '',
        zd27: '',
        zd28: '',
        zd29: '',
        zd30: '',
        zd31: '',
        zd32: '',
        zd33: '',
        zd34: '',
        zd35: '',
        zd36: '',
        zd37: '',
        zd38: '',
        zd39: '',
        zd40: '',
        zd41: '',
        zd42: '',
        zd43: '',
        zd44: '',
        zd45: '',
        zd46: '',
        zd47: '',
        zd48: '',
        zd49: '',
        zd50: '',
        zd51: '',
        zd52: '',
        zd53: '',
        zd54: '',
        zd55: '',
        zd56: '',
        zd57: '',
        zd58: '',
        zd59: '',
        zd60: '',
        zd61: '',
        zd62: '',
        zd63: '',
        zd64: '',
        zd65: '',
        zd66: '',
        zd67: '',
        zd68: '',
        zd69: '',
        zd70: '',
        zd71: '',
        zd72: '',
        zd73: '',
        zd74: '',
        zd75: '',
        zd76: '',
        zd77: '',
        zd78: '',
        zd79: '',
        zd80: '',
        zd81: '',
        zd82: '',
        zd83: '',
        zd84: '',
        zd85: '',
        zd86: '',
        zd87: '',
        zd88: '',
        zd89: '',
        zd90: '',
        zd91: '',
        zd92: '',
        zd93: '',
        zd94: '',
        zd95: '',
        zd96: '',
        zd97: '',
        zd98: '',
        zd99: '',
        zd100: '',
        zd101: '',
        zd102: '',
        zd103: '',
        zd104: '',
        zd105: '',
        zd106: '',
        zd107: '',
        zd108: '',
        zd109: '',
        zd110: '',
        zd111: '',
        zd112: '',
        zd113: '',
        zd114: '',
        zd115: '',
        zd116: ''
      },
      loading: false
    }
  },
  created () {
    this.getDate()
  },
  methods: {
    getDate () {
      const date = new Date()
      this.year = date.getFullYear().toString()
    },
    handleChange () {
      const list = {
        nd: this.year,
        flag: 'query'
      }
      count(list).then(response => {
        this.dataFrom = response.data
      })
    },
    handleStatistic () {
      this.loading = true
      count({nd: this.year}).then(response => {
        this.dataFrom = response.data
        this.loading = false
      })
    },
    save () {
      var obj = Object.assign(this.dataFrom, {nd: this.year})
      add(obj).then(response => {
        this.dataFrom = response.data
        this.$message({
          message: '保存成功',
          type: 'success'
        })
      })
    }
  }
}
</script>

<style scoped>
  .statistic-table {
    margin-top: 20px;
    border-collapse: collapse;
    border: 1px solid #ccc;
    text-align: center;
  }
  .statistic-table td, .statistic-table th {
    padding: 8px 15px;
    border: 1px solid #ccc;
    font-size: 14px;
  }

  input {
    text-align: center;
    border-style:none;
    -moz-appearance:textfield;
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button{
    -webkit-appearance: none !important;
    margin: 0
  }
</style>
