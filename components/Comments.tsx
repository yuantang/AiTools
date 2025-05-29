"use client"

import { useState, useEffect } from "react"
import { MessageCircle, ThumbsUp, Reply, Edit, Trash2, Flag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/hooks/useAuth"
import { CommentsAPI, type Comment } from "@/lib/api/comments"

interface CommentsProps {
  toolId: string
}

export function Comments({ toolId }: CommentsProps) {
  const { user } = useAuth()
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'helpful'>('newest')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState("")
  const [editingComment, setEditingComment] = useState<string | null>(null)
  const [editText, setEditText] = useState("")

  useEffect(() => {
    fetchComments()
  }, [toolId, sortBy])

  const fetchComments = async () => {
    try {
      setLoading(true)
      const result = await CommentsAPI.getToolComments(toolId, { sortBy })
      setComments(result.data)
    } catch (error) {
      console.error("Failed to fetch comments:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitComment = async () => {
    if (!user || !newComment.trim()) return

    try {
      setSubmitting(true)
      const comment = await CommentsAPI.createComment({
        tool_id: toolId,
        user_id: user.id,
        content: newComment.trim()
      })
      
      setComments(prev => [comment, ...prev])
      setNewComment("")
    } catch (error) {
      console.error("Failed to submit comment:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleSubmitReply = async (parentId: string) => {
    if (!user || !replyText.trim()) return

    try {
      const reply = await CommentsAPI.createComment({
        tool_id: toolId,
        user_id: user.id,
        content: replyText.trim(),
        parent_id: parentId
      })

      setComments(prev => prev.map(comment => 
        comment.id === parentId 
          ? { ...comment, replies: [...(comment.replies || []), reply] }
          : comment
      ))
      
      setReplyingTo(null)
      setReplyText("")
    } catch (error) {
      console.error("Failed to submit reply:", error)
    }
  }

  const handleEditComment = async (commentId: string) => {
    if (!user || !editText.trim()) return

    try {
      const updatedComment = await CommentsAPI.updateComment(commentId, editText.trim(), user.id)
      
      setComments(prev => prev.map(comment => 
        comment.id === commentId 
          ? updatedComment
          : {
              ...comment,
              replies: comment.replies?.map(reply => 
                reply.id === commentId ? updatedComment : reply
              )
            }
      ))
      
      setEditingComment(null)
      setEditText("")
    } catch (error) {
      console.error("Failed to edit comment:", error)
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!user || !confirm("确定要删除这条评论吗？")) return

    try {
      await CommentsAPI.deleteComment(commentId, user.id)
      
      setComments(prev => prev.filter(comment => {
        if (comment.id === commentId) return false
        if (comment.replies) {
          comment.replies = comment.replies.filter(reply => reply.id !== commentId)
        }
        return true
      }))
    } catch (error) {
      console.error("Failed to delete comment:", error)
    }
  }

  const handleHelpful = async (commentId: string) => {
    if (!user) return

    try {
      await CommentsAPI.toggleHelpful(commentId, user.id)
      
      setComments(prev => prev.map(comment => 
        comment.id === commentId 
          ? { ...comment, helpful_count: comment.helpful_count + 1 }
          : {
              ...comment,
              replies: comment.replies?.map(reply => 
                reply.id === commentId 
                  ? { ...reply, helpful_count: reply.helpful_count + 1 }
                  : reply
              )
            }
      ))
    } catch (error) {
      console.error("Failed to mark as helpful:", error)
    }
  }

  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => (
    <div className={`${isReply ? 'ml-12 mt-4' : ''}`}>
      <div className="flex items-start space-x-3">
        <Avatar className="w-8 h-8">
          <AvatarImage src={comment.user?.avatar_url} />
          <AvatarFallback>{comment.user?.name?.[0]}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <span className="font-medium text-sm">{comment.user?.name}</span>
            {comment.user?.role === 'admin' && (
              <Badge variant="secondary" className="text-xs">管理员</Badge>
            )}
            <span className="text-xs text-gray-500">
              {new Date(comment.created_at).toLocaleDateString()}
            </span>
          </div>
          
          {editingComment === comment.id ? (
            <div className="space-y-2">
              <Textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="text-sm"
                rows={3}
              />
              <div className="flex space-x-2">
                <Button size="sm" onClick={() => handleEditComment(comment.id)}>
                  保存
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => {
                    setEditingComment(null)
                    setEditText("")
                  }}
                >
                  取消
                </Button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-700 mb-2">{comment.content}</p>
              
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <button
                  onClick={() => handleHelpful(comment.id)}
                  className="flex items-center space-x-1 hover:text-blue-600"
                  disabled={!user}
                >
                  <ThumbsUp className="w-3 h-3" />
                  <span>{comment.helpful_count}</span>
                </button>
                
                {!isReply && user && (
                  <button
                    onClick={() => setReplyingTo(comment.id)}
                    className="flex items-center space-x-1 hover:text-blue-600"
                  >
                    <Reply className="w-3 h-3" />
                    <span>回复</span>
                  </button>
                )}
                
                {user?.id === comment.user_id && (
                  <>
                    <button
                      onClick={() => {
                        setEditingComment(comment.id)
                        setEditText(comment.content)
                      }}
                      className="flex items-center space-x-1 hover:text-blue-600"
                    >
                      <Edit className="w-3 h-3" />
                      <span>编辑</span>
                    </button>
                    
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="flex items-center space-x-1 hover:text-red-600"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>删除</span>
                    </button>
                  </>
                )}
                
                <button className="flex items-center space-x-1 hover:text-red-600">
                  <Flag className="w-3 h-3" />
                  <span>举报</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* 回复表单 */}
      {replyingTo === comment.id && (
        <div className="ml-11 mt-3 space-y-2">
          <Textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="写下您的回复..."
            className="text-sm"
            rows={3}
          />
          <div className="flex space-x-2">
            <Button size="sm" onClick={() => handleSubmitReply(comment.id)}>
              回复
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => {
                setReplyingTo(null)
                setReplyText("")
              }}
            >
              取消
            </Button>
          </div>
        </div>
      )}
      
      {/* 回复列表 */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} isReply={true} />
          ))}
        </div>
      )}
    </div>
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5" />
            <span>用户评论 ({comments.length})</span>
          </CardTitle>
          
          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">最新</SelectItem>
              <SelectItem value="oldest">最早</SelectItem>
              <SelectItem value="helpful">最有用</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* 评论表单 */}
        {user ? (
          <div className="space-y-3">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="分享您的想法..."
              rows={3}
            />
            <div className="flex justify-end">
              <Button 
                onClick={handleSubmitComment}
                disabled={submitting || !newComment.trim()}
              >
                {submitting ? "发布中..." : "发布评论"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 bg-gray-50 rounded-lg">
            <p className="text-gray-600 mb-2">登录后参与讨论</p>
            <Button variant="outline" size="sm">
              登录
            </Button>
          </div>
        )}
        
        {/* 评论列表 */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex space-x-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-16 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : comments.length > 0 ? (
          <div className="space-y-6">
            {comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">还没有评论</h3>
            <p className="text-gray-500">成为第一个评论的用户吧！</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
