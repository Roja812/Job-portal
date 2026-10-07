package com.jobportal.repository;

import com.jobportal.entity.Job;
import com.jobportal.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByCompanyOwnerOrderByIdDesc(User owner);

    // all text params are non-null ("" = no filter) so the query stays portable
    @Query("""
        select j from Job j where j.active = true
        and (lower(j.title) like lower(concat('%', :q, '%')) or lower(j.company.name) like lower(concat('%', :q, '%')))
        and lower(coalesce(j.skills, '')) like lower(concat('%', :skill, '%'))
        and lower(coalesce(j.location, '')) like lower(concat('%', :location, '%'))
        and (:type = '' or j.employmentType = :type)
        and coalesce(j.salaryMax, 0) >= :minSalary
        order by j.id desc""")
    List<Job> search(@Param("q") String q, @Param("skill") String skill, @Param("location") String location,
                     @Param("type") String type, @Param("minSalary") int minSalary);
}
