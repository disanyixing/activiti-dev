import saapi from '@/api/saquestion'
import capi from '@/api/choicequestion'
import aapi from '@/api/answer'

// 示例使用:
// 假设我们有一个试卷ID为 "1001"，我们想要检查三名学生 "studentA", "studentB", "studentC" 的作答情况，
// 我们将返回总题数，和每个学生被批改的题数和已作答的题数。
// example input:
// checkStudentsPaper("1001", ["studentA", "studentB", "studentC"]).then(results => {
//     console.log(results);
// });
// example output:
// {
//   totalQuestions: 20,
//   studentResults: {
//     "studentA": { answeredQuestions: 20, gradedAnswers: 18 },
//     "studentB": { answeredQuestions: 15, gradedAnswers: 15 },
//     "studentC": { answeredQuestions: 20, gradedAnswers: 20 }
//   }
// }
//
// 在这个例子中，总共有20个问题。studentA回答了所有问题，但只有18个得到了评分。studentB回答了15个问题，全部得到了评分。
// studentC回答并得到评分了所有问题。
export async function checkStudentsPaper(paperId, studentNames) {
  // 获取试卷上的所有问题
  const saQuestions = await saapi.listSaQuestions({ paperId: paperId, current: 1, size: -1 })
  const choiceQuestions = await capi.listChoiceQuestions({ paperId: paperId, current: 1, size: -1 })

  // 提取 questionId 列表
  const saQuestionIds = saQuestions.data.records.map(q => q.id)
  const choiceQuestionIds = choiceQuestions.data.records.map(q => q.id)
  const allQuestionIds = [...saQuestionIds, ...choiceQuestionIds]

  // 总题数
  const totalQuestions = allQuestionIds.length

  // 对每个学生进行检查
  const studentResults = {}

  for (const student_name of studentNames) {
    const studentAnswers = await aapi.listAnswers({ paperId: paperId, creator: student_name, current: 1, size: -1 })

    // 统计每个学生已作答的题数和被批改的题数
    const answeredQuestionIds = studentAnswers.data.records.map(a => a.questionId)
    const gradedAnswersCount = studentAnswers.data.records.filter(a => a.score >= 0).length

    studentResults[student_name] = {
      answeredQuestions: answeredQuestionIds.length,
      gradedAnswers: gradedAnswersCount
    }
  }

  return { totalQuestions, studentResults }
}
